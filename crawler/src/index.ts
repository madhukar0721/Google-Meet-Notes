import {
  Builder,
  Browser,
  By,
  Key,
  until,
  WebDriver,
} from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function openMeet(driver: WebDriver) {
  try {
    await driver.get("https://meet.google.com/rqe-kbvt-ssw");
    const popupButton = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(),"Got it")]')),
      10000
    );
    await popupButton.click();
    // await driver.sleep(100000);

 
    const nameInput = await driver.wait(
      until.elementLocated(By.xpath('//input[@placeholder="Your name"]')),
      10000
    );
    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys("Madhukar Bot");
    await driver.sleep(1000);

    const joinButton = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(),"Ask to join")]')),
      100000
    );
    await joinButton.click();
   

  }catch(e){
      console.log(e);
}
}

async function getDriver() {
  const options = new Options({});
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--use-fake-ui-for-media-stream");
  options.addArguments("-window-size=1080,720");
  options.addArguments("--auto-select-desktop-capture-source=[RECORD]");
  options.addArguments("--enable-usermedia-screen-capturing");
  options.addArguments(`--auto-select-tab-captuure-source-by-title="Meet"`);


  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  return driver;
}

async function startScreenRecordig(driver: WebDriver) {
console.log("startScreenRecordig");
  
	const response = await driver.executeScript(`
	function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

function startRecording(stream, lengthInMS) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = (event) => data.push(event.data);
  recorder.start();

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = (event) => reject(event.name);
  });

  let recorded = wait(lengthInMS).then(() => {
    if (recorder.state === "recording") recorder.stop();
  });

  return Promise.all([stopped, recorded]).then(() => data);
}

function audioRecord(screenStream) {
  const audioContext = new AudioContext();
  const screenAudioStream = audioContext.createMediaStreamSource(screenStream);
  const audioEl1 = document.querySelectorAll("audio")[0];
  const audioEl2 = document.querySelectorAll("audio")[1];
  const audioEl3 = document.querySelectorAll("audio")[2];
  const audioElStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject);
  const audioElStream2 = audioContext.createMediaStreamSource(audioEl3.srcObject);
  const audioElStream3 = audioContext.createMediaStreamSource(audioEl2.srcObject);
  const audioDest = audioContext.createMediaStreamDestination();

  screenAudioStream.connect(audioDest);
  audioElStream1.connect(audioDest);
  audioElStream2.connect(audioDest);
  audioElStream3.connect(audioDest);

  return audioDest;
}

navigator.mediaDevices.getDisplayMedia({
  video: { displaySurface: "browser" },
  audio: true,
  preferCurrentTab: true
}).then(async (screenStream) => {
  const audioDest = await audioRecord(screenStream);
  const combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks()
  ]);

  console.log("before recording");

  const recordedChunks = await startRecording(combinedStream, 60000);

  console.log("Recording complete");

  let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  const recording = document.createElement("video");
  recording.src = URL.createObjectURL(recordedBlob);
  const downloadButton = document.createElement("a");
  downloadButton.href = recording.src;
  downloadButton.download = "RecordedVideo.webm";
  downloadButton.click();
  console.log("Download complete");
  screenStream.getTracks().forEach(track => track.stop());
  audioStream.getTracks().forEach(track => track.stop());

}).catch((err) => console.log(err));`);


	
  
  console.log("response", response);
  driver.sleep(100000);
}

async function main() {
    const driver = await getDriver();
    
    await openMeet(driver);

    
    await startScreenRecordig(driver);

}

main();
