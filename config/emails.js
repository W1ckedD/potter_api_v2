exports.verifyAccountEmail = (token, userEmail) => ({
    from: process.env.API_EMAIL,
    to: userEmail,
    subject: 'Verify Potter API V2 Account',
    html: `<h1>
                    To verify your account <a href="${process.env.BASE_URL}/verify-account/${token}">click here</a>
                </h1>`,
});

exports.newUserRegisterd = user => ({
    from: process.env.API_EMAIL,
    to: process.env.PERSONAL_EMAIL,
    subject: `New User Registerd at ${user.createdAt}`,
    html: `<p>email: ${user.email}</p>
            <p>created at: ${user.createdAt}</p>
    `
});