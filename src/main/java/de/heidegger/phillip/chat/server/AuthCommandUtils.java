package de.heidegger.phillip.chat.server;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import de.heidegger.phillip.chat.commands.userCommands.Logout;
import de.heidegger.phillip.chat.events.userEvents.LoggedIn;
import de.heidegger.phillip.chat.events.userEvents.LogginFailed;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.logging.Level;

public class AuthCommandUtils  {

    private final String salt;
    private final String secret;

    public AuthCommandUtils(String salt, String secret) {
        this.salt = salt;
        this.secret = secret;
    }

    public void performLogin(ChatClient client, ChatServerTrustedAPI manager, EMail email, String token) {
        if (token == null) {
            manager.spread(new LogginFailed(client.getId(), email));
            return;
        }

        // If the client provides correct checkPassword credentials, but is already
        // authenticated, we have to switch the client to the new identity (maybe)
        if (client.isAuthenticated()) {
            // Same identity, checkPassword is a NOOP. But create log entry, a correctly implemented
            // client should never checkPassword if the socket is already promoted
            if (email.equals(client.getEmail())) {
                manager.log(Level.WARNING, "User " + email + " already " +
                        "logged in. No need to checkPassword again.");
                return;
            } else {
                new Logout().execute(client, manager);
            }
        }
        manager.log(Level.INFO, "User " + email + " logged in.");
        ChatClientUserData chatClientUserData = manager.getUser(email);
        manager.promoteClient(client, email, chatClientUserData.getName());
        manager.spread(new LoggedIn(client.getId(), client.getUserName(), client.getEmail(),
                token));
        manager.informUserAboutRooms(client);
    }

    public String generateToken(String userName, EMail email, Sha1Hash password) {
        try {
            Algorithm algorithm = Algorithm.HMAC512(salt + secret + password.getHash());
            return JWT.create()
                    .withIssuer("chatBackend")
                    .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 5))
                    .withClaim("name", userName)
                    .withClaim("email", email.asText())
                    .sign(algorithm);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String validateToken(ChatClient client, String token) {

        // TODO: return the token, if it is valid for the client
        return null;
    }



}
