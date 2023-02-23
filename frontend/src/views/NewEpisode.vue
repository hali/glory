<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <div>
      <div class="container">
        <div class="row text-white">
          <p class="col-md-12">
            Название эпизода:
          </p>
        </div>
        <div class="row">  
          <div class="col-md-12">
            <input
              v-model="name" 
              class="form-control col-md-12"
              name="name"
              placeholder="Однажды в далёком и тёмном лесу два зайца в ловушку поймали лису"
            >
          </div>
        </div>
        <div class="row text-white">
          <div class="col-md-6">
            <p>Коллекции:</p>
            <input
              v-model="branch"
              class="form-control col-md-12" 
              name="branch"
              placeholder="Русреал-17"
            >
          </div> 
          <div class="col-md-6">
            <p class="col-md-6">
              Предупреждения:
            </p>
            <input
              v-model="warning"
              class="form-control col-md-12" 
              name="warning"
              placeholder="МПРЕГ? Обсуждение суицида? Напиши об этом!"
            >
          </div>
        </div>
        <div class="row text-white">
          <div class="col-md-6">
            <p class="col-md-6">
              Время действия:
            </p>
            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                v-model="dates.simple"
                slot-scope="{focus, blur}"
                :config="{allowInput: true}"
                class="form-control datepicker"
                @on-open="focus"
                @on-close="blur"
              />
            </base-input>       
          </div>
          <div class="col-md-6">
            <p>Сеттинг (игровой мир):</p>
            <input
              v-model="world" 
              class="form-control col-md-12"
              name="world"
              placeholder="АУ, магический СССР"
            >
          </div>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            Описание эпизода:
          </p>
        </div>
        <div class="row">  
          <div class="col-md-12">
            <textarea
              id="exampleFormControlTextarea1"
              v-model="description"
              name="description"
              class="form-control form-control-alternative"
              rows="3"
              placeholder="Вольное текстовое описание затравки или эпизода в целом - пока без HTML и картинок..."
            />
          </div>
        </div>
        <div class="row">
          <p />
        </div>
        <div class="row">
          <div
            class="col-md-6"
            align="left"
          >
            <span @click="addEpisode(4)"><base-button type="secondary">
              Черновик
            </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >  
            <span @click="addEpisode(3)"> <base-button type="success">
              Открыть
            </base-button></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {addEpisode} from '../services/EpisodeService';
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { getPlayer } from '../services/PlayerService';

export default {
    name: "NewEpisode",
    components: { flatPicker, BaseButton, BaseInput },
    data() {
        return {
          dates: {
            simple: "2022-07-20"
          },
          name: '',
          description: '',
          status_id: 1,
          author_id: 1,
          branch_id: 1,
          world: '',
          warning: ''
        };
      },
      async created() {
			const idToken = await this.$auth.tokenManager.get('idToken');
			this.claims = await Object.entries(idToken.claims).map(entry => ({ claim: entry[0], value: entry[1] }));
			const email = this.claims[2].value;
			getPlayer(email).then(response => {
				this.author_id = response[0].id;
			});
		},
    methods: {
      addEpisode(status) {
        let processed_description = this.description.replace('- ', '— ');
        const payload = {
              name: this.name,
              description: processed_description,
              time_of_action: this.dates.simple,
              status_id: status,
              author_id: this.author_id,
              branch_id: this.branch_id,
              world: this.world
          };
          addEpisode(payload).then(response => {
            this.$router.push({name:'viewepisode', params:{id:response}})
          });
      } 
    }  
};
</script>
<style>
</style>
