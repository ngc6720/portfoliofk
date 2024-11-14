import gain01Url from "/core/au/processors/basic/gain01.js?worker&url";
import playerUrl from "/core/au/processors/gen/player.js?worker&url";
import onehUrl from "/core/au/processors/gen/oneh.js?worker&url";

export default async function () {
  let audioCtx = null;
  const pNodes = { create: {} };

  function addCreateMethod(processorName) {
    pNodes.create[processorName] = (name, options) => {
      try {
        pNodes[name] = new AudioWorkletNode(audioCtx, processorName, options);
      } catch (e) {
        console.error(`** Error: Unable to create worklet node: ${e}`);
      }
      return pNodes[name];
    };
  }

  try {
    audioCtx = new AudioContext({ sampleRate: 44100 });
    audioCtx.suspend();
  } catch (e) {
    console.error(`** Error: Unable to create audio context: ${e}`);
  }
  // await fakePromise(2000)
  try {
    // console.log("adding audioWorkletNode modules")

    await audioCtx.audioWorklet.addModule(gain01Url);
    addCreateMethod("gain01");

    await audioCtx.audioWorklet.addModule(playerUrl);
    addCreateMethod("player");

    await audioCtx.audioWorklet.addModule(onehUrl);
    addCreateMethod("oneh");
  } catch (e) {
    console.error(`** Error: Unable to add audio worklet module: ${e}`);
  }

  return [audioCtx, pNodes];
}
