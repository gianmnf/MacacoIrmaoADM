const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.notificacao = functions.firestore
    .document('ocorrencia/{ocorrenciaId}')
    .onCreate((snap,context) => {
     /*   const val = snap.data();
        const nomeUser = val.context.nomeSobrenome;
    // send a notification to each device token
      const snapshots = admin.database().ref('/admin').once('value');

      var data_snap_arr = [];
      snapshots.forEach(childSnapshot => {
          var tokenADM = childSnapshot.val().token;
          tokenADM.key = childSnapshot.key;
          data_snap_arr.push(tokenADM);
      })
      let payload = {
          notification: {
              title: 'Nova ocorrência',
              body: 'Uma nova ocorrência foi registrada.'
          }
      }
     const allTokens = Promise.all(data_snap_arr.map(handleSnapshot));  
     return admin.messaging().sendToDevice(allTokens,payload) */
    return Promise.all([admin.database().ref('admin/"+key+"/token').once('value')]).then(
        results => {
            const token = results[0];
            if(!token.hasChildren()) return null;
            let payload = {
              notification: {
                  title:'Nova Ocorrência',
                  body:'Uma nova Ocorrência foi registrada'
              }
          }
          const tokens = Object.keys(token.val());
          return admin.messaging().sendToDevice(tokens,payload);
        }
    )
    })
