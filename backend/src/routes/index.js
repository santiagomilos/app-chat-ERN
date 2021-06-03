const { Router } = require('express');
const webpush = require('../webpush');
const router = Router();

let pushSubscription;

router.post('/subscription', async (req, res) => {
   pushSubscription = req.body;
   res.status(200).json();
});

router.post('/join', async (req, res) => {

   const { name } = req.body;

   const payload = JSON.stringify({
      title: `${name} joined the chat room`,
      message: `Now ${name} is part of the chat, say hello!`,
   });

   try{
      await webpush.sendNotification(pushSubscription, payload);
   }catch (err){
      console.log(err)
   }
   res.status(200).json();

});

module.exports = router;