import Parse from "../parseConfig";

export default async function subscribe(className) {
  const query = new Parse.Query(className);
  const subscription = await query.subscribe();
  subscription.on('open', () => {
    console.log('Subscription opened');
  })
  subscription.on('create', obj => {
    console.log('New object created: ', obj);
  });
  subscription.on('update', (obj) => {
    console.log('Object updated: ', obj);   
  });
  subscription.on('delete', (obj) => {
    console.log('Object deleted: ', obj);
  });
  subscription.on('error', (error) => console.error('LiveQuery error:', error));
}
