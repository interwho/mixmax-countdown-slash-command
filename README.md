# Countdown Slash Command for Mixmax

This command allows you to add a live countdown image to your outgoing emails using Mixmax. Times should be in the format HH:MM:SS.

## Demo Output
Countdown until 07:17:39 GMT on 2016-10-17

![Demo Countdown](http://45.79.132.130:80/image.gif?time=2016-10-17T07:17:39.377Z)

## Usage

1. Install node
2. Install other required system dependancies using `sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev` on Debian or `brew install cairo` on macOS
3. Update your URL and server port (if desired) in constants.js
4. Install the app by running `npm install`
5. Run the app using `npm start`

To check the time input, request:

```
curl http://localhost/typeahead?text=1
```

To generate the countdown image url, request:

```
curl http://localhost/resolver?text=1:00:00
```

To get a countdown image, request:

```
curl http://localhost/image.gif?time=iso_format_end_time
```
