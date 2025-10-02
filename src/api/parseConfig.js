import Parse from 'parse';

Parse.initialize(
    "MU94jK8k5E2t26SAqRgfxLBDga6JWUW5PRF5I2nn", 
    "gSXPRwnvMNmHVfi8Gz1MT10PUOItnuFot1zdMJRI"
);
Parse.serverURL = "https://parseapi.back4app.com";
Parse.liveQueryServerURL = 'wss://silastodolistapp.b4a.io';

export default Parse;