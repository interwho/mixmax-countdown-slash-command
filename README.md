# Countdown Slash Command for Mixmax

This command allows you to add a live countdown image to your outgoing emails using Mixmax. Times should be in the format HH:MM:SS.

## Usage

1. Run `sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev`
2. Install using `npm install`
3. Run using `npm start`

To check the time input, request:

```
curl http://localhost:8080/typeahead?text=1
```

To generate the countdown image url, request:

```
curl http://localhost:8080/resolver?text=1:00:00
```

To get a countdown image, request:

```
curl http://localhost:8080/image.gif?time=unix_timestamp_in_gmt
```
