"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Neo4JUser } from "@/types";
import * as React from "react";
import TinderCard from "react-tinder-card";
import { neo4jSwipe } from '@/neo4j.action';// Add this import

interface HomepageClientComponentProps {
  currentUser: Neo4JUser;
  users: Neo4JUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
  currentUser,
  users,
}) => {
  const handleSwipe = async (direction: string, userId: string) => {
    const isMatch = await neo4jSwipe(currentUser.applicationId, direction, userId);
    if (isMatch) {
      alert(`Congratulations, you have a match with ${currentUser.firstname} ${currentUser.lastname}`);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4">
        Hello {currentUser.firstname} {currentUser.lastname}
      </h1>
      <div>
        {users.map((user) => (
          <TinderCard 
            onSwipe={(direction) => handleSwipe(direction, user.applicationId)} 
            key={user.applicationId}
          >
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