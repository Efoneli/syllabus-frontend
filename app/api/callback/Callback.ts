
// pages/api/callback.js
import auth0 from '../../auth0';

export default async function callback(req, res) {
  try {
    await auth0.handleCallback(req, res, {
      onUserLoaded: async (req, res, session, state) => {
        // Capture the user details from session.user
        const user = session.user;
        
        // Call your backend API to save the user details
        await fetch('http://localhost:3030/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      },
    });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
