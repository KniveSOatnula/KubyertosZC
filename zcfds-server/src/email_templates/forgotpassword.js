const html = (link) => `<html>
<head>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
    <style>
    body {
            margin: 0px auto;
        }
        h1 {
            font-family: Lato;
            font-size: 50px;
            color: #60747F;
            padding-bottom: 5%;
        }
        p {
            font-family: Arial;
            font-size: 12px;
            color: #555555;
        }
        a {
            color: #2E6CA9;
        }
        #email_body {
            background-color: #EEEEEE;
            margin-left: auto;
            margin-right: auto;
            display: table;
            padding: 10%;
            padding-bottom: 1%;
            text-align: center;
        }
        #header {
            background-color: #2E6CA9;
            height: 25%;
            text-align: center;
        }
        img:first-child {
            height: 90%;
            padding-top: 5px;
        }
        #b1 {
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            max-width: 220px;
            width: 174px;
            width: auto;
            border: 0px solid transparent;
            padding: 15px 25px 15px 25px;
            font-family: Lato;
            font-weight: bold;
            font-size: 25px;
            color: white;
            background-color: #2E6CA9;
            text-align: center;
            text-decoration: none;
        }
        @media (max-width: 480px) {
            h1 {
                font-size: 25px;
            }
            #b1 {
                font-size: 20px;
                padding: 10px 20px 10px 20px;
            }
            #header {
                height: 10%;
            }
        }
    </style>
    <div id="header">
        <img src="https://bit.ly/2ktV1YU" alt="eventmakerph_logo"></img>
    </div>
</head>
<body>
    <div id="email_body">
        <h1 id="title">We received a password reset request from you. Please click on the button below to set a new password.</h1>
        <a href="${link}" id="b1">Reset Password</a>
        <hr style="margin-top: 20%">
        <p> © 2018 (App Name). All Rights Reserved.</p>
        <p><a href="#" target="_blank">Visit Website</a></p>
    </div>
</body>`;

module.exports = html;