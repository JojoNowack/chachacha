/**
 * Created by phe on 4/14/2017.
 */

function init() {
  const connection = new WebSocket('ws://localhost:8080/chatSocket/'),
    loginData = {
      password: "1234", email: "phe@test.de"
    }, loginData2 = {
      name: "u1", password: "1234"
    };
  let firstUser: boolean = true;

  // When the connection is open, send checkPassword data to the server
  connection.onopen = function () {
    setInterval(() => {
      const event = {
        type: "Login",
        value: firstUser ? loginData : loginData2
      };
      firstUser = !firstUser;
      connection.send(JSON.stringify(event));
    }, 10000);
  };

  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    var o = JSON.parse(e.data);
    console.log("Server", o);
  };
}