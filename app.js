//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const port = 3500;
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.fName
    var lastName = req.body.lName
    var email = req.body.email
    // console.log(firstName + " " + lastName + " " + email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,

                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = 'https://us14.api.mailchimp.com/3.0/lists/7225dc1058'
    
    const options = {
        method: 'POST',
        auth: 'harsh1:0f9cab7163b97c4c93e655f91c77cff3-us14'
    }
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html', response.content);
        }else{
            res.sendFile(__dirname + '/failure.html', response.content);
        }

        response.on('data', function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect('/');
});




app.listen(process.env.PORT || 3000, function () {
    console.log("Server is Running on Port " + port);
})



// {"name":"freddie'/''s Favorite Hats","contact":{"company": "Mailchimp","address1": "675 Ponce de Leon Ave NE","address2": "Suite 5000","city": "Atlanta","state": "GA","zip": "30308","country": "US","phone":""},"permission_reminder":"you'\''re reciving this email because you signed up for updates about freddie'\''s newest hats.","campaign_defaults":{"from_name":"freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}




