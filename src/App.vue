<template>
  <div class="container_main">
    <div class="hamon" href="#">
      <span
        class="ring"
        v-bind:class="{ ring_animation: aurdioRunnable }"
      ></span>
    </div>
    <img src="@/assets/image/title.png" class="title_img" />
    <br />

    <div class="morse_text_box">
      <span>{{ morseText }}</span>
    </div>

    <button
      v-for="item in alphabetItems"
      v-bind:key="item"
      @click="resultClick(item)"
      class="result_btn"
    >
      {{ item }}
    </button>
    <br />
    <br />

    <button
      v-for="item in numberItems"
      v-bind:key="item"
      @click="resultClick(item)"
      class="result_btn"
    >
      {{ item }}
    </button>
    <br />
    <br />

    <button @click="startStopClick" class="ope_btn">{{ opeBtnText }}</button>
    <br />
    <br />
    主に３級アマチュア無線で出題されるモールス信号を覚えるためのサイトです。<br />
    文字で覚えることに加えて、耳も少し鍛えることを目指します！

    <result-modal ref="resultModal" @onResultModalClose="onResultModalClose" />
  </div>
</template>

<script>
import morse_list from './components/morse_list';
import ResultModal from './components/ResultModal';

// Sleepメソッド化
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// 再生速度（現在は固定）
const MORSE_SPEED = 100;

// 長点
const MORSE_LONG = '－';

export default {
  components: {
    ResultModal,
  },

  data: function() {
    return {
      morseText: '',
      alphabetItems: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
      numberItems: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      questionList: [],
      currentQuestion: null,
      aurdioRunnable: false,
      audioReset: false,
      opeBtnText: 'Start',
    };
  },

  methods: {
    /**
     * 再生の開始・停止
     */
    startStopClick: function() {
      // 開始状態の場合は停止
      if (this.aurdioRunnable) {
        this.stopAudio(() => {});
        this.morseText = '';
        this.opeBtnText = 'Start';
        return;
      }

      // 停止状態の場合は開始
      this.initQuestion();
      this.showNextQuestion();
      this.opeBtnText = 'Stop';
    },

    /**
     * 解答クリック
     */
    resultClick: function(anser) {
      if (!this.aurdioRunnable) {
        return;
      }

      // 停止処理中の場合は、クリック無効
      if (this.audioReset) {
        return;
      }

      // はずれ
      if (anser !== this.currentQuestion.key) {
        this.$refs.resultModal.open(this.currentQuestion);
        return;
      }

      // 正解
      this.$toasted.success('正解');
      this.stopAudio(() => {
        this.showNextQuestion();
      });
    },

    /**
     * 不正解時のモーダルクローズ
     */
    onResultModalClose: function() {
      console.log('onResultModalClose');
      this.stopAudio(() => {
        this.showNextQuestion();
      });
    },

    /**
     * 問題の初期化
     */
    initQuestion: function() {
      // モールスのリストを配列化して、未出題データとする
      this.questionList = Object.entries(morse_list).map(([key, value]) => ({
        key,
        value,
      }));
    },

    /**
     * 次の問題を表示する
     */
    showNextQuestion: function() {
      this.currentQuestion = this.getNextQuestion();
      this.showQuestion(this.currentQuestion);
      this.playMorseSignal(this.currentQuestion.value.morseText);
    },

    /**
     * 次の問題を取得する
     */
    getNextQuestion: function() {
      // 未出題リストから今回の出題をランダムに取得
      let maxIndex = this.questionList.length;
      if (maxIndex === 0) {
        this.initQuestion();
        maxIndex = this.questionList.length;
      }
      const index = Math.floor(Math.random() * Math.floor(maxIndex));
      console.log(`len=${this.questionList.length} index=${index}`);

      // 次の問題
      const ret = this.questionList[index];

      // 出題済みのものを未出題リストから除去
      this.questionList.splice(index, 1);

      return ret;
    },

    /**
     * 問題を表示する
     */
    showQuestion: function(morseItem) {
      this.morseText = morseItem.value.morseText;
    },

    /**
     * 問題を再生する
     */
    playMorseSignal: async function(morseText) {
      // 前回再生中のものが停止されるのを待つ
      // while (this.audioReset) {
      //   await sleep(100);
      // }

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
      this.playAudio(gainList);
    },

    /**
     * オーディオを再生する
     */
    playAudio: async function(gainList) {
      try {
        this.aurdioRunnable = true;

        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        const gain = audioCtx.createGain();
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.connect(gain);

        // 指定要求があったら抜ける
        while (!this.audioReset) {
          let totalPlayTime = 0;
          const baseTime = audioCtx.currentTime;
          for (const gainItem of gainList) {
            gain.gain.setValueAtTime(gainItem.vol, baseTime + totalPlayTime);

            totalPlayTime += gainItem.playTime / 1000;
          }

          // 停止要求をチェックするため再生時間分Slepp
          await sleep(totalPlayTime * 1000);
        }

        oscillator.stop();

        this.audioReset = false;
        this.aurdioRunnable = false;
      } catch (e) {
        alert(e);
      }
    },

    /**
     * オーディオを停止する
     */
    stopAudio: async function(callback) {
      console.log('stopAudio');
      this.audioReset = true;

      // 停止を待つ
      while (this.audioReset) {
        await sleep(100);
      }

      // 停止後のコールバック呼び出し
      callback();
    },
  },
};
</script>

<style></style>
