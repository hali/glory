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
    <div v-if="this.episode.author_id == this.current_user_id">
      <div class="container">
        <div class="row text-white">
          <p class="col-md-12">
            Название эпизода:
          </p>
        </div>
        <div class="row">  
          <div class="col-md-12">
            <input
              v-model="episode.name" 
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
              v-model="episode.collection"
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
              v-model="episode.warning"
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
                v-model="episode.timeOfAction"
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
              v-model="episode.world" 
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
              v-model="episode.description"
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
            <span  @click="$router.push({ name: 'viewepisode', params: { id: this.episode.id } })">
            <base-button type="secondary">
              Отмена
            </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >  
            <span @click="updateEpisode"> <base-button type="success">
              Сохранить
            </base-button></span>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="this.episode.author_id != this.current_user_id"><card>Нельзя редактировать чужие эпизоды!</card></div>
  </section>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { updateEpisode, viewEpisode} from '../services/EpisodeService';
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { getPlayer } from '../services/PlayerService';

export default {
    name: "EditEpisode",
    components: { flatPicker, BaseButton, BaseInput },
    data() {
        return {
          episode: {
            id: this.$route.params.id,
            name: "",
            description: "",
            timeOfAction: "",
            world: "",
            collection: "",
            author_id: 0,
            warning: ""
          },
          current_user_id: 1,
          email: ''
        };
      },
      async mounted() {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
                if (value.key == 'email') this.email = value.value;
            });
            getPlayer(this.email).then(response => {
                this.current_user_id = response[0].id;
            });
            viewEpisode(this.episode.id).then(response => {
                this.episode.name = response[0].name;
                this.episode.description = response[0].description;
                this.episode.timeOfAction = (new Date(response[0].timeOfAction)).toLocaleString('en-CA', {dateStyle: 'short'});
                this.episode.collection = response[0].branch;
                this.episode.world = response[0].world;
                this.episode.status = response[0].status;
                this.episode.author_id = response[0].author_id;
            });
        },
    methods: {
      updateEpisode() {
        let processed_description = this.episode.description.replace('- ', '— ');
        const payload = {
              name: this.episode.name,
              description: processed_description,
              time_of_action: this.episode.timeOfAction,
              author_id: this.episode.author_id,
              //branch_id: this.episode.collection,
              world: this.episode.world
          };
          updateEpisode(this.episode.id, payload).then(() => {
            this.$router.push({name:'viewepisode', params:{id:this.episode.id}})
          });
      } 
    }  
};
</script>
<style>
</style>
