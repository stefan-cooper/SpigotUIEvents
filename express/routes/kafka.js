const { Router } = require("express");
const { Kafka } = require('kafkajs')
const router = Router();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: Math.random().toString() })
// let allNotifs = []
consumer.connect()
consumer.subscribe({ topic: 'all'})
consumer.run({ eachMessage: async ({ topic, partition, message }) => { 
  console.log(topic, message.value.toString())
  if (topic === 'login') loginNotifs.push({value: message.value.toString(), time: new Date().getTime()}); 
  else if (topic === 'disconnect') disconnectNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  else if (topic === 'death') deathNotifs.push({value: message.value.toString(), time: new Date().getTime()});
  else if (topic === 'chat') chatNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  else if (topic === 'damage') damageNotifs.push({value: message.value.toString(), time: new Date().getTime()});
  return true } 
})

router.get("/kafka_damage", (req, res) => {
  if (req.query.time) {
    res.json(damageNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_login", (req, res) => {
  if (req.query.time) {
    res.json(loginNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_death", (req, res) => {
  if (req.query.time) {
    res.json(deathNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_disconnect", (req, res) => {
  if (req.query.time) {
    res.json(disconnectNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_chat", (req, res) => {
  if (req.query.time) {
    res.json(chatNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

// router.get("/kafka_all", (req, res) => {
//   if (req.query.time) {
//     res.json(chatNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
//   } else {
//     res.sendStatus(400)
//   }
// });

module.exports = router;
