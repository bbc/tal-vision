#TAL App for Lancaster University's Vision Service

Vision is Lancaster University's internal IPTV service available for staff and students. Over 50 television and radio channels are made available live, and each month over 28,000 programmes are recorded and made available on demand.

In collaboration with BBC R&D, a "big screen" interface was developed for the service. Targeted at games consoles and Smart TVs, the interface was developed using the open source [Television Application Layer](http://fmtvp.github.io/tal/) project.

Ross Wilson, a MSci student and software developer for the Vision project, has developed the interface with assistance from BBC R&D developers. Users can watch VOD (video on demand) content, see their viewing history from any device that they've accessed Vision from, and resume previously watched content from their last known position.
 
A recent feature that is currently being developed is towards a Second Screen experience for TAL-interface users. Using WebSockets and a [cross-platform Vision mobile application](https://github.com/rosswilson/vision-mobile) (also developed by Ross Wilson) users can playback content remotely from their mobile device onto any TAL compliant device running the Vision TAL application. This work can be found in the `websockets` feature branch.

# Install

Anyone can install the Vision TAL interface application, though most backend calls are to internal-only API endpoints - so ensure you're either on campus, or using a Lancaster VPN connection.

```bash
npm install
bower install
```

# Run

```bash
npm start
open localhost:3000
```
