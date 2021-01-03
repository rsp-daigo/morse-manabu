<template>
  <div class="container_main">
    <div class="hamon" href="#">
      <span
        class="ring"
        v-bind:class="{ ring_animation: this.morsePlayer.isAurdioRunnable() }"
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
    モールス信号を覚えるためのサイトです。<br />
    文字で覚えることに加えて、耳も少し鍛えることを目指します！

    <result-modal ref="resultModal" @onResultModalClose="onResultModalClose" />
  </div>
</template>

<script>
import morse_list from './components/morse_list';
import ResultModal from './components/ResultModal';
import MorsePlayer from './components/morse_player';

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
      opeBtnText: '開始',
      morsePlayer: new MorsePlayer(),
    };
  },

  methods: {
    /**
     * 再生の開始・停止
     */
    startStopClick: function() {
      // 開始状態の場合は停止
      if (this.morsePlayer.isAurdioRunnable()) {
        this.stopAudio(() => {});
        this.morseText = '';
        this.opeBtnText = '開始';
        return;
      }

      // 停止状態の場合は開始
      this.initQuestion();
      this.showNextQuestion();
      this.opeBtnText = '中断';
    },

    /**
     * 解答クリック
     */
    resultClick: function(anser) {
      if (!this.morsePlayer.isAurdioRunnable()) {
        return;
      }

      // 停止処理中の場合は、クリック無効
      if (this.morsePlayer.isAudioReset()) {
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
      this.morsePlayer.playMorseSignal(this.currentQuestion.value.morseText);
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
     * オーディオを停止する
     */
    stopAudio: async function(callback) {
      console.log('stopAudio');
      this.morseText = '';
      this.morsePlayer.stop(callback);
    },
  },
};
</script>
