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
    <div>
      <div class="container">
        <div class="row text-white">
          <p class="col-md-12">
            {{ $t('storyName') }}
          </p>
        </div>
        <div class="row">  
          <div class="col-md-12">
            <input
              v-model="name" 
              class="form-control col-md-12"
              name="name"
            >
          </div>
        </div>
        <div class="row text-white">
          <div class="col-md-6">
            <p>{{ $t('tags') }}</p>
            <multiselect
              v-model="collection" 
              :options="collection_options" 
              :searchable="true" 
              :multiple="true"
              :close-on-select="false" 
              label="description"
              track-by="description"
              :show-labels="false"
              placeholder="Pick a value"
              :taggable="true"
              @tag="addTag"
            />
          </div> 
          <div class="col-md-6">
            <p class="col-md-6">
              {{ $t('warnings') }}
            </p>
            <input
              v-model="warning"
              class="form-control col-md-12" 
              name="warning"
            >
          </div>
        </div>
        <div class="row text-white">
          <div class="col-md-6">
            <p>
              {{ $t('storyTime') }}
            </p>
            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                v-model="dates.simple"
                slot-scope="{focus, blur}"
                :config="{allowInput: true, dateFormat: 'Y-m-d', disableMobile: true}"
                class="form-control datepicker"
                @on-open="focus"
                @on-close="blur"
              />
            </base-input>       
          </div>
          <div class="col-md-6">
            <p>{{ $t('world') }}</p>
            <input
              v-model="world" 
              class="form-control col-md-12"
              name="world"
            >
          </div>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            {{ $t('storyDescription') }}
          </p>
        </div>
        <div class="row">  
          <p class="col-md-12">
            <quill-editor
              v-model:content="description" 
              content-type="html" 
              :options="options"
              class="form-control rounded-0"
            />
          </p>
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
              {{ $t('createDraft') }}
            </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >  
            <span @click="addEpisode(3)"> <base-button type="success">
              {{ $t('createStoryButton') }}
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
import { addEpisode, updateEpisodeBranches, getAllBranches, addBranch } from '../services/EpisodeService';
import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import { getPlayer } from '../services/PlayerService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
    name: "NewEpisode",
    components: { flatPicker, BaseButton, BaseInput, QuillEditor, Multiselect },
    data() {
        return {
          dates: {
            simple: "2022-07-20"
          },
          name: '',
          description: '',
          email: '',
          status_id: 1,
          author_id: 1,
          branch_id: 1,
          collection: [],
          world: '',
          warning: '',
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
      async created() {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            getPlayer(this.email).then(response => {
                this.author_id = response[0].id;
            });
            document.title = "Glory - Открыть эпизод";
            getAllBranches().then(response => {
                this.collection_options = response});
        },
    methods: {
      addEpisode(status) {
        let processed_description = this.description.replaceAll('-- ', '— ').replaceAll('- ', '— ').replaceAll('  ', ' ');
        const payload = {
              name: this.name,
              description: processed_description,
              time_of_action: (new Date(this.dates.simple)).toISOString().split('T')[0],
              status_id: status,
              author_id: this.author_id,
              branch_id: this.branch_id,
              world: this.world
          };
          addEpisode(payload).then(response => {
            let cl = new Array(Object.values(this.collection))[0];
              let arrayedCollections = [];
              cl.forEach((value) => arrayedCollections.push(value.id));
              if (arrayedCollections.length > 0) 
                updateEpisodeBranches(response, arrayedCollections).then(() => {
              });
            this.$router.push({name:'viewepisode', params:{id:response}})
          });
      },
      addTag (newTag) {
          addBranch(newTag).then(response => {
            this.collection.push({id: response, description: newTag});  
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
