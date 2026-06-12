const BASE_URL = "http://localhost:8081/api/auth";

/* =========================
   REGISTER
========================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name")
            .value.trim();

        const email =
            document.getElementById("email")
            .value.trim();

        const password =
            document.getElementById("password")
            .value.trim();

        if (!name || !email || !password) {

            alert("Please fill all fields");
            return;

        }

        try {

            const response = await fetch(
                `${BASE_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const result =
                await response.text();

            if (response.ok) {

                localStorage.setItem(
                    "registeredUser",
                    JSON.stringify({
                        name,
                        email,
                        password
                    })
                );

                alert(
                    "Registration Successful ✅"
                );

                window.location.href =
                    "login.html";

            } else {

                alert(
                    result ||
                    "Registration Failed ❌"
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Server Connection Failed ❌"
            );

        }

    });

}

/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value.trim();

            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "registeredUser"
                    )
                );

            if (!savedUser) {

                alert(
                    "Please register first ❌"
                );

                window.location.href =
                    "register.html";

                return;

            }

            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "userName",
                    savedUser.name
                );

                localStorage.setItem(
                    "userEmail",
                    savedUser.email
                );

                alert(
                    "Login Successful ✅"
                );

                window.location.href =
                    "dashboard.html";

            } else {

                alert(
                    "Invalid Email or Password ❌"
                );

            }

        }
    );

}

/* =========================
   AUTH CHECK
========================= */

function checkAuth() {

    const isLoggedIn =
        localStorage.getItem(
            "isLoggedIn"
        );

    const path =
        window.location.pathname;

    if (
        path.includes("dashboard.html")
        && !isLoggedIn
    ) {

        window.location.href =
            "login.html";

    }

}

checkAuth();

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "isLoggedIn"
    );

    window.location.href =
        "login.html";

}

window.logout = logout;