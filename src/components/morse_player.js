// 再生速度（現在は固定）
const MORSE_SPEED = 100;

// 長点
const MORSE_LONG = '－';

// Sleepメソッド化
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class MorsePlayer {
  constructor() {
    this.aurdioRunnable = false;
    this.audioReset = false;

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = null;
  }

  /**
   * 生成中か返す
   */
  isAurdioRunnable() {
    return this.aurdioRunnable;
  }

  /**
   * 中断要求中か返す
   */
  isAudioReset() {
    return this.audioReset;
  }

  /**
   * 問題を再生する
   */
  async playMorseSignal(morseText) {
    // 点と線でばらしてループ
    const ch = Array.from(morseText);
    const gainList = [];
    for (const item of ch) {
      // 長点は短点の3倍
      let playTime = 1;
      if (item === MORSE_LONG) {
        playTime = 3;
      }

      // 再生速度の設定
      playTime *= MORSE_SPEED;

      gainList.push({ playTime, vol: 0.9 });

      // 要素間のインターバル
      const interval = 1 * MORSE_SPEED;
      gainList.push({ playTime: interval, vol: 0 });
    }
    // １セット再生し終えた後のインターバル
    gainList.push({ playTime: 1000, vol: 0 });

    // 再生実行
    await this.playAudio(gainList);
  }

  /**
   * オーディオを再生する
   */
  async playAudio(gainList) {
    try {
      this.aurdioRunnable = true;

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = 440;
      const gain = this.audioCtx.createGain();
      gain.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.oscillator.connect(gain);

      // 指定要求があったら抜ける
      while (!this.audioReset) {
        let totalPlayTime = 0;
        const baseTime = this.audioCtx.currentTime;
        for (const gainItem of gainList) {
          gain.gain.setValueAtTime(gainItem.vol, baseTime + totalPlayTime);

          totalPlayTime += gainItem.playTime / 1000;
        }

        // 停止要求をチェックするため再生時間分Slepp
        await sleep(totalPlayTime * 1000);
      }

      this.oscillator.stop();
      this.oscillator = null;

      this.audioReset = false;
      this.aurdioRunnable = false;
    } catch (e) {
      alert(e);
    }
  }

  async stop(callback) {
    console.log('stopAudio');

    // 停止要求を通知
    this.audioReset = true;

    // 音を止める
    if (this.oscillator != null) {
      this.oscillator.stop();
    }

    // 停止を待つ
    while (this.audioReset) {
      await sleep(100);
    }

    // 停止後のコールバック呼び出し
    callback();
  }
}
