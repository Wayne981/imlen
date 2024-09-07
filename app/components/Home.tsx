"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Neo4JUser } from "@/types";
import * as React from "react";
import TinderCard from "react-tinder-card";

interface HomepageClientComponentProps {
  currentUser: Neo4JUser;
  users: Neo4JUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
  currentUser,
  users,
}) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4">
        Hello {currentUser.firstname} {currentUser.lastname}
      </h1>
      <div>
        {users.map((user) => (
          <TinderCard key={user.applicationId}>
            <Card>
              <CardHeader>
                <CardTitle>{user.firstname} {user.lastname}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
            </Card>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default HomepageClientComponent;