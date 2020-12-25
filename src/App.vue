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
      console.log(this.questionList);
    },

    showNextQuestion: function() {
      this.currentQuestion = this.getNextQuestion();
      this.showQuestion(this.currentQuestion);
      this.playAudio();
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

    playAudio: function() {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      const gain = audioCtx.createGain();
      oscillator.connect(gain);
      gain.gain.value = 1;
      gain.connect(audioCtx.destination);

      oscillator.start();
    },

    resultClick: function(anser) {
      // はずれ
      if (anser !== this.currentQuestion.key) {
        console.log('NG');
        return;
      }

      // 正解
      console.log('OK');
      this.showNextQuestion();
    },
  },
};
</script>

<style></style>
