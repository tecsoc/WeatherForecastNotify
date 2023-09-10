const everyMorning = () => {
  fetchJMAWeatherInfo();
  pushWeatherForecastForTargetUser();
};

const pushWeatherForecastForTargetUser = () => {
  const sheet = new SpreadSheet();
  const lineClient = new LineApiClient();
  const pushUserIdList = sheet.getPushTargetUserList();
  if (pushUserIdList.length <= 1) return;  
  const payload = {
    to: pushUserIdList,
    messages: []
  };
  payload = lineClient.createTemplateWeatherForecastMessage(payload, sheet); 
  pushMulticastMessage(payload);
};

const fetchJMAWeatherInfo = () => {
  const fetchWeatherHandler = new fetchJMA();
  const sheet = new SpreadSheet();
  
  const rainfallProbabilityList = fetchWeatherHandler.getRainfallProbability();
  const weatherOverview = fetchWeatherHandler.fetchWeatherOverview();
  const weeklyWeatherForecastList = fetchWeatherHandler.getWeeklyWeatherForecast();
  
  console.log(`降水確率: ${rainfallProbabilityList}`);
  console.log(`天気概況:\n${weatherOverview}`);
  console.log(`週間天気予報: ${weeklyWeatherForecastList}`);
  
  sheet.setRainfallProbability(rainfallProbabilityList);
  sheet.setWeatherOverview(weatherOverview);
  sheet.setWeeklyWeatherForecast(weeklyWeatherForecastList);
};

const sendToDeveopper = () => {
  const userId = PropertiesService.getScriptProperties().getProperty('userId');
  const lineClient = new LineApiClient();
  let payload = {
    to: userId,
    messages: []
  };
  payload = lineClient.pushTextMessage(payload, 'テスト送信');
  lineClient.pushMessage(payload);
}