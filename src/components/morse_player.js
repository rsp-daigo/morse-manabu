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
   * モールス信号を再生する
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

      gainList.push({ playTime, vol: 1 });

      // 要素間のインターバル
      const interval = 1 * MORSE_SPEED;
      gainList.push({ playTime: interval, vol: 0 });
    }
    // １セット再生し終えた後のインターバル
    gainList.push({ playTime: MORSE_SPEED * 3, vol: 0 });

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
      this.oscillator.type = 'square';
      this.oscillator.frequency.value = 440;
      const gain = this.audioCtx.createGain();
      // gain.gain.value = 0;
      gain.connect(this.audioCtx.destination);

      this.oscillator.connect(gain);
      this.oscillator.start();

      // 指定要求があったら抜ける
      while (!this.audioReset) {
        let totalPlayTime = 0;
        const baseTime = this.audioCtx.currentTime;

        // // 最初の音をフェードインさせるための音量設定（linearRampToValueAtTimeを利かせるために必要）
        // gain.gain.setValueAtTime(0, baseTime);

        for (const gainItem of gainList) {
          // sineで音の開始と終わりにプチプチしたノイズが発生する為、フェードインで滑らかにする
          // 「0.001（1ms）」で固定的な時間でフェードインさせる
          // gain.gain.linearRampToValueAtTime(
          //   gainItem.vol,
          //   baseTime + totalPlayTime + 0.001
          // );

          gain.gain.setValueAtTime(gainItem.vol, baseTime + totalPlayTime);

          totalPlayTime += gainItem.playTime / 1000;

          // フェードアウト
          // gain.gain.linearRampToValueAtTime(
          //   0,
          //   baseTime + totalPlayTime - 0.001
          // );
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

  /**
   * 再生の停止を要求する
   * @param {function} callback コールバック
   */
  async stop(callback) {
    console.log('stopAudio');

    // 停止要求を通知
    this.audioReset = true;

    // 停止を待つ
    while (this.audioReset) {
      await sleep(100);
    }

    // 停止後のコールバック呼び出し
    callback();
  }
}
