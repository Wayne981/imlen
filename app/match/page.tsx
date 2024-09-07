import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getMatches } from "@/neo4j.action"; // Assuming this function exists

export default async function MatchPage() {
    const { isAuthenticated, getUser } = getKindeServerSession();
  
    if (!(await isAuthenticated())) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
    }
  
    const user = await getUser();
    
    if (!user || !user.id) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
    }
    
    const matches = await getMatches(user.id);

    return (
        <main>
            {matches.map((match) => (
                <Card key={match.id}>
                    <CardHeader>
                        <CardTitle>
                            {match.firstname} {match.lastname}
                        </CardTitle>
                        <CardDescription>{match.email}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </main>
    );
}