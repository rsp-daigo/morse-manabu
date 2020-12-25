<template>
  <div>
    モールス信号のお勉強<br />

    <button @click="startClick">Start</button>
    <br />
    <span>{{ morseText }}</span>
    <br />
    <button
      v-for="item in alphabetItems"
      v-bind:key="item"
      @click="resultClick(item)"
    >
      {{ item }}
    </button>
    <br />
    <button
      v-for="item in numberItems"
      v-bind:key="item"
      @click="resultClick(item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script>
import morse_list from './components/morse_list';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const MORSE_SPEED = 100;

export default {
  // name: 'App',
  components: {},

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
      // audioCtx: null,
      oscillator: null,
      audioActive: true,
    };
  },

  methods: {
    startClick: function() {
      this.initQuestion();
      this.showNextQuestion();
    },

    initQuestion: function() {
      // モールスのリストを配列化して、未出題データとする
      this.questionList = Object.entries(morse_list).map(([key, value]) => ({
        key,
        value,
      }));
    },

    showNextQuestion: function() {
      this.currentQuestion = this.getNextQuestion();
      this.showQuestion(this.currentQuestion);
      this.playMorseSignal(this.currentQuestion.value.morseText);
    },

    getNextQuestion: function() {
      // 未出題リストから今回の出題を取得
      let maxIndex = this.questionList.length;
      if (maxIndex === 0) {
        this.initQuestion();
        maxIndex = this.questionList.length;
      }
      const index = Math.floor(Math.random() * Math.floor(maxIndex));

      const ret = this.questionList[index];
      this.questionList.splice(index);

      return ret;
    },

    showQuestion: function(morseItem) {
      this.morseText = morseItem.value.morseText;
    },

    playMorseSignal: async function(morseSignal) {
      const ch = Array.from(morseSignal);

      this.audioActive = true;
      while (this.audioActive) {
        for (const item of ch) {
          if (!this.audioActive) {
            break;
          }

          let playTime = 3;
          if (item === '・') {
            playTime = 1;
          }
          playTime *= MORSE_SPEED;
          this.playAudio(playTime);

          const interval = 1 * MORSE_SPEED;
          await sleep(playTime + interval);
        }
        await sleep(1000);
      }
      this.oscillator.stop(0);
    },

    playAudio: function(playTime) {
      try {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        this.oscillator = audioCtx.createOscillator();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = 440;
        const gain = audioCtx.createGain();
        this.oscillator.connect(gain);
        gain.gain.value = 1;
        gain.connect(audioCtx.destination);

        this.oscillator.start();
        this.oscillator.stop(playTime / 1000);
      } catch (e) {
        alert(e);
      }
    },

    resultClick: function(anser) {
      // はずれ
      if (anser !== this.currentQuestion.key) {
        return;
      }

      // 正解
      this.oscillator.stop(0);
      this.audioActive = false;
      this.showNextQuestion();
    },
  },
};
</script>

<style></style>
