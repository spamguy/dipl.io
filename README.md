# dipl.io [![Build Status](https://travis-ci.org/spamguy/diplomacy.svg?branch=master)](https://travis-ci.org/spamguy/diplomacy)

[dipl.io website][3] | [dipl.io blog][4]

[Diplomacy][1] is a [Risk][2]-like board game with a strong Internet fan base. Many browser-based clients exist, but none have quite the flexibility of the play-by-email servers they intended to replace. The dipl.io project seeks to be as full-featured as possible and take full advantage of the modern web browser's abilities.

[1]:http://en.wikipedia.org/wiki/Diplomacy_(game)
[2]:http://en.wikipedia.org/wiki/Risk_(game)
[3]:http://dipl.io
[4]:http://blog.dipl.io

# Goals
1. The development process will be fully transparent. Custom map and ruleset creation should be simple but flexible.
2. The user interface will be responsive and fun.
3. The project will bring together the best characteristics of previous Diplomacy implementations.
4. The project will be fully unit-tested. (This is for my own good and reparations against many years of crimes against testability.)
5. Integrate fully with the zond/diplicity backend.
6. Rapid games (< 15 minutes per phase) will be possible without page refreshes.

# Technology
The application as a whole consists of two parts:
 * The website. Developed using AngularJS.
 * The backend, responsible for scheduling adjudication events and processing data. Sent to zond/diplicity through its API.
