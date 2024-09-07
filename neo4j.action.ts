"use server"

import {driver} from "@/db";
import { Neo4JUser } from "./types/index";

export const getUserByID = async (id: string) => { 
    const result = await driver.executeQuery(
        `MATCH (u:User {applicationId: $applicationId}) RETURN u`,
 {applicationId: id}
    );
    const users = result.records.map((record) => record.get("u").properties);
    if (users.length === 0) {
        return null;
    }
    return users[0] as Neo4JUser;
};

// whatever the id we want , the function will return the we want database indha 


export const createUser = async (user: Neo4JUser) => {
    const { applicationId, email, firstname, lastname } = user;
    await driver.executeQuery(
        `CREATE (u:User { applicationId: $applicationId, email: $email, firstname: $firstname, lastname: $lastname })
        RETURN u { .applicationId, .email, .firstname, .lastname } AS user`,
        { applicationId, email, firstname, lastname }
    );
}  // create user function

export const getUserWithNoConnection = async (id: string) => { 
    const result = await driver.executeQuery(
        `MATCH (cu:User {applicationId: $applicationId})
         MATCH (ou:User)
         WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou
         RETURN ou`,
        { applicationId: id }
    );
    const users = result.records.map((record) => record.get("ou").properties);
    return users as Neo4JUser[];
};

export const neo4jSwipe = async (id: string, swipe: string, userId: string) => {
    const type = swipe === "left" ? "DISLIKE" : "LIKE";
    await driver.executeQuery(
        `MATCH (cu:User {applicationId: $id}), (ou:User {applicationId: $userId}) 
         CREATE (cu)-[:${type} {createdAt: datetime()}]->(ou)`,
        {
            id,
            userId,
        }
    );

    if (type === "LIKE") {
        const result = await driver.executeQuery(
            `MATCH (cu:User {applicationId: $id})-[:LIKE]->(ou:User {applicationId: $userId}) 
             WHERE (ou)-[:LIKE]->(cu) 
             RETURN ou AS match`,
            {
                id,
                userId,
            }
        );

        const matches = result.records.map(
            (record) => record.get("match").properties
        );
        return matches.length > 0;
    }

    return false;
};

// 45 - like and dislike connection between the users 
