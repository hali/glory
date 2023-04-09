<!-- eslint-disable vue/no-v-model-argument -->
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
    <div v-if="episode.author_id == current_user_id">
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
            <multiselect
              v-model="episode.collection" 
              :options="collection_options" 
              :searchable="true" 
              :multiple="true"
              :close-on-select="false" 
              label="description"
              track-by="description"
              :show-labels="false"
              placeholder="Pick a value"
              :taggable="true" @tag="addTag"
            />
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
                :config="{allowInput: true, dateFormat: 'Y-m-d', disableMobile: true}"
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
            <quill-editor
              v-model:content="episode.description" 
              content-type="html" 
              :options="options"
              class="form-control"
              style="height: 250px"
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
            <span @click="$router.push({ name: 'viewepisode', params: { id: episode.id } })">
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
    <div
      v-if="episode.author_id != current_user_id"
      class="container"
    >
      <card>Нельзя редактировать чужие эпизоды!</card>
    </div>
  </section>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { updateEpisode, viewEpisode, getAllBranches, updateEpisodeBranches, 
    getEpisodeBranches, addBranch } from '../services/EpisodeService';
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { getPlayer } from '../services/PlayerService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
    name: "EditEpisode",
    components: { flatPicker, BaseButton, BaseInput, QuillEditor, Multiselect },
    data() {
        return {
          episode: {
            id: this.$route.params.id,
            name: "",
            description: "",
            timeOfAction: "",
            world: "",
            collection: [],
            author_id: 0,
            warning: ""
          },
          current_user_id: 1,
          email: '',
          collection_options: ['one', 'two', 'three'],
          options: {
            debug: 'warn',
            modules: {
              toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }], ['clean']]
            },
            readOnly: false,
            theme: 'snow'
          }
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
                this.episode.timeOfAction = (new Date(response[0].timeOfAction)).toISOString().split('T')[0];
                this.episode.collection = response[0].branch;
                this.episode.world = response[0].world;
                this.episode.status = response[0].status;
                this.episode.author_id = response[0].author_id;
                document.title = "Glory - Редактировать - " + response[0].name;
            });
            getAllBranches().then(response => {
                this.collection_options = response});
            getEpisodeBranches(this.episode.id).then(response => {
                this.episode.collection = response});    
        },
    methods: {
      updateEpisode() {
        let processed_description = this.episode.description.replace('- ', '— ');
        const payload = {
              name: this.episode.name,
              description: processed_description,
              time_of_action: (new Date(this.episode.timeOfAction)).toISOString().split('T')[0],
              author_id: this.episode.author_id,
              world: this.episode.world
          };
        updateEpisode(this.episode.id, payload).then(() => {
              let cl = new Array(Object.values(this.episode.collection))[0];
              let arrayedCollections = [];
              cl.forEach((value) => arrayedCollections.push(value.id));
              updateEpisodeBranches(this.episode.id, arrayedCollections).then(() => {
                  
              });
              this.$router.push({name:'viewepisode', params:{id:this.episode.id}});
        }); 
        
      },
      addTag (newTag) {
          addBranch(newTag).then(response => {
            this.episode.collection.push({id: response, description: newTag});  
            const tag = {
              description: newTag,
              id: response
            };
            this.collection_options.push(tag);      
          });
      }  
    }  
};
</script>
<style>
</style>
