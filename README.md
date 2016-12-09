# dipl.io [![CircleCI](https://circleci.com/gh/spamguy/dipl.io.svg?style=svg)](https://circleci.com/gh/spamguy/dipl.io)

[dipl.io website][3] | [dipl.io blog][4]

[Diplomacy][1] is a [Risk][2]-like board game with a strong Internet fan base. Many browser-based clients exist, but none have quite the flexibility of the play-by-email servers they intended to replace. The dipl.io project seeks to be as full-featured as possible and take full advantage of the modern web browser's abilities.

[1]:http://en.wikipedia.org/wiki/Diplomacy_(game)
[2]:http://en.wikipedia.org/wiki/Risk_(game)
[3]:http://dipl.io
[4]:http://blog.dipl.io
[5]:https://github.com/spamguy/diplomacy
[6]:https://github.com/zond/diplicity

# Goals
1. The development process will be fully transparent. Improvements and new variants are welcome from the community.
2. The user interface will be responsive and fun.
3. The project will bring together the best characteristics of previous Diplomacy implementations.
4. The project will be fully unit-tested. (This is for my own good and reparations against many years of crimes against testability.)
5. Integrate fully with the zond/diplicity backend.
6. Rapid games (< 15 minutes per phase) will be possible without page refreshes.

### How is this project different from [spamguy/diplomacy][5]?
The original project aimed to be an end-to-end solution using PostgreSQL + nginx + Redis + AngularJS. That's a lot of stuff to manage.

This project retains the front-end of the original and discards the back-end. By collaborating with the [diplicity project][6], I can focus on delivering a quality user interface.

# Technology
The application as a whole consists of two parts:
 * The website. Developed using AngularJS.
 * The backend, responsible for scheduling adjudication events and processing data. Sent to zond/diplicity through its API.
 
# Setup
This assumes you have npm and bower working.

1. Clone this repository.
2. Clone the [diplicity repository](https://github.com/zond/diplicity). Follow its setup and startup instructions.
3. Run `npm install -g grunt-cli` anywhere.
2. Run `bower install` in dipl.io's directory.
3. Run `npm install` in dipl.io's directory.
4. OPTIONAL: Run `npm test` or `grunt test` (same thing).
5. Run `grunt serve`.

If you have a web server on your machine already, set it up to serve the `/client` directory in this repository.

If you don't, nginx is recommended, though it takes some work. This will be touched upon in a wiki article.
