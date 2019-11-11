Upload the following verification files to your server

1   google8da564bcac2c6c9c.html
2   BingSiteAuth.xml
3   manifest.json
4   OneSignalSDKUpdaterWorker.js
5   OneSignalSDKWorker.js

Upload the files to http://<YOUR WEBSITE DOMAIN>
Confirm successful upload by visiting below links in your browser.

http://<YOUR ROOT WEBSITE DOMAIN>/google8da564bcac2c6c9c.html
http://<YOUR ROOT WEBSITE DOMAIN>/BingSiteAuth.xml
http://<YOUR ROOT WEBSITE DOMAIN>/manifest.json
http://<YOUR ROOT WEBSITE DOMAIN>/OneSignalSDKUpdaterWorker.js
http://<YOUR ROOT WEBSITE DOMAIN>/OneSignalSDKWorker.js

<!-- IMPORTANT -->
<YOUR ROOT WEBSITE DOMAIN> should be any ROOT domain for example gcox.com, acm.gcox.com, gcoxgroup.com etc. 
But it should not contain any path for example acm.gcox.com/login, gcox.com/xyz/ etc. it should be absolute domain of your website.
Some examples of your websites are:

http://gcox.com/google8da564bcac2c6c9c.html
http://gcox.com/BingSiteAuth.xml
...
http://gcox.com/OneSignalSDKWorker.js

&

http://gcoxgroup.com/google8da564bcac2c6c9c.html
http://gcoxgroup.com/BingSiteAuth.xml
...
http://gcoxgroup.com/OneSignalSDKWorker.js

etc. etc.

All the files described above should open in browser while visiting the links as shown above.



<!-- IMPORTANT -->
<!-- To stay verified, don't remove the files, even after verification succeeds. -->
<!-- Below is the example of how and where tracking code should be placed in order to achieve accurate metrics -->
<!-- TRACKING CODE SHOULD BE PLACED AT EACH PAGE ON THE WEBSITE -->
<!-- 
    TRACKING CODE SHOULD BE PLACED INSIDE <head> TAG AS ABOVE AS CAN BE. 
    PREFERABLY JUST AFTER OPENING <head> TAG AS SHOWN IN EXAMPLE BELOW.
-->

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- NASH360 WebTracker Tag Manager -->
    <script type="text/javascript">
        var _mtm = _mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src='https://tracking.tupleai.com/js/container_YtuIEpLc.js'; s.parentNode.insertBefore(g,s);
    </script>
    <!-- End NASH360 WebTracker Tag Manager -->

    <!-- NASH360 WebTracker NoJS Tracker -->
    <noscript>
        <p><img src="//tracking.tupleai.com/js/tracker.php?idsite=3&amp;rec=1" style="border:0;" alt="" /></p>
    </noscript>
    <!-- End NASH360 WebTracker -->

    <!-- NASH360 WebTracker Push Notification -->
    <link rel="manifest" href="/manifest.json" />
    <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
    <!-- End NASH360 WebTracker Push Notification -->

    <!--                                                        -->
    <!--                                                        -->
    <!-- NOW REST OF GCOX HEAD CODE FOR EXAMPLE                 -->
    <!-- <meta charset="utf-8">                                 -->
    <!-- <meta http-equiv="X-UA-Compatible" content="IE=edge">  -->
    <!--                                                        -->
    <!--                                                        -->

</head>