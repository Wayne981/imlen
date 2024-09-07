import { getUserByID, createUser, getUserWithNoConnection } from '../neo4j.action';
import HomepageClientComponent from '@/app/components/Home';
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
const currentUser = await getUserByID(user.id);

  // Add a return statement here to render something or redirect
  return (
    <main>
      {currentUser && (
      <HomepageClientComponent currentUser={currentUser} users={usersWithNoConnection} />
      )}
    </main>
  );
  
}