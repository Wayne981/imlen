import { getUserByID, createUser, getUserWithNoConnection } from '../neo4j.action';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
  }

  const user = await getUser(); // i know that user exists here  
  // at this point user surely exists 
  if (!user)
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
  
const usersWithNoConnection = await getUserWithNoConnection(user.id);


  // Add a return statement here to render something or redirect
  return (
    <main>
      <h1>Welcome, {user.given_name}</h1>
      <pre>
        <code>{JSON.stringify(usersWithNoConnection, null, 2)}</code>
      </pre>
      {/* Add more content as needed */}
    </main>
  );
}