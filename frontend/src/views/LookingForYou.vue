<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div>
    <div>
      <section class="section-shaped my-0 ">
        <div class="shape shape-style-1 shape-dark shape-skew">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div class="container">
        <div class="card">
          <div class="col-md-12" v-html="$t('looking_rules')">
          </div>
        </div>
        <p />
        </div> 
        
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <base-button v-if="!show_new_topic_form" type="primary" @click="show_new_topic_form = true">Открыть новую заявку</base-button>
            </div>
          </div>
          <div class="row" v-if="show_new_topic_form">
            <div class="col-md-12">
              <card>
                  <div class="row">
                  <p class="col-md-12">
                    Краткая заявка:
                  </p>
                </div>
                <div class="row">  
                  <div class="col-md-12">
                    <input
                      v-model="new_topic_name" 
                      class="form-control col-md-12"
                      name="new_topic_name"
                    >
                  </div>
                </div>
                <div class="row">
                      <p class="col-md-12">
                        Подробности:
                      </p>
                    </div>
                    <div class="row">  
                      <p class="col-md-12">
                        <quill-editor
                          v-model:content="new_topic_description" 
                          content-type="html" 
                          :options="options"
                          class="form-control rounded-0"
                          ref="newTopicEditor"
                        />
                      </p>
                    </div>
               <div class="row" align="right">
                  <div class="col-md-12">
                    <base-button type="secondary" @click="show_new_topic_form = false">{{ $t('cancel') }}</base-button>
                    <base-button type="success" @click="addNewTopic()">{{ $t('post') }}</base-button>
                  </div>
                </div>  
              </card>
            </div>
          </div>
          
        </div>
        <p />
        <div class="container">
            <base-button v-if="topics_filter === 1" type="primary" @click="reloadTopics(2)">Показать закрытые заявки</base-button>
            <base-button v-if="topics_filter === 2" type="primary" @click="reloadTopics(1)">Показать открытые заявки</base-button>
        </div>
        <div v-for="topic in topics" :key="topic.id">
          <div class="container" v-if="topic.status_id === topics_filter">
          <div class="row">
            <div class="col-md-12">
              <card>
                
                <div class="row">
                    <div class="col-md-10"><b>({{topic.nickname}}) {{topic.name}}</b></div>
                    <div class="col-md-2 text-right">
                      <span
                        v-if="topic.id!==expanded_topic || expanded_topic === 0"
                        @click="changeExpansionStatus(topic.id)"
                      >
                        <base-button 
                          size="sm"
                          type="primary"
                          icon="fa fa-plus-square"
                          title="Развернуть"
                        />
                      </span>
                      <span
                        v-if="topic.id===expanded_topic"
                        @click="changeExpansionStatus(topic.id)"
                      >
                        <base-button 
                          size="sm"
                          type="primary"
                          icon="fa fa-minus-square"
                          title="Свернуть"
                        />
                      </span>
                      <span
                        v-if="topic.status_id === 1 && topic.author_id === current_player_id"
                        @click="closeTopic(topic.id)"
                      >
                        <base-button 
                          size="sm"
                          type="primary"
                          icon="fa fa-stop"
                          title="Закрыть заявку"
                        />
                      </span>
                      <span
                        v-if="topic.status_id === 2 && topic.author_id === current_player_id"
                        @click="openTopic(topic.id)"
                      >
                        <base-button 
                          size="sm"
                          type="primary"
                          icon="fa fa-play"
                          title="Открыть заявку"
                        />
                      </span>
                    </div>
                    <div class = "col-md-11" v-if="topic.id==expanded_topic">
                        <div style="white-space:pre-wrap; text-justify: auto;"                            
                                v-html="topic.description" />
                    </div>            
                    <hr class="col-md-11" v-if="topic.id==expanded_topic">
                    <div class="col-md-12" v-if="topic.id==expanded_topic">
                        <div v-for="reply in topic.replies" :key="reply.id" class="col-md-12">
                             <div>
                                <b>{{reply.nickname}}</b> 
                             </div> 
                             <div style="white-space:pre-wrap; text-justify: auto;"                               
                                v-html="reply.body"
                              />
                             <hr>
                        </div>
                        <div v-if="topic.id==expanded_topic && topic.status_id == 1">
                          <div class="col-md-12">
                            <quill-editor
                              v-model:content="new_reply" 
                              ref="replyEditor"
                              content-type="html" 
                              :options="options"
                              class="form-control rounded-0"
                              style="height: 250px"
                            />
                          </div>
                          <div class="col-md-12 text-right">
                            <base-button type="success" @click="addReplyToTopic(topic.id)">
                                {{ $t('post') }}
                            </base-button>
                          </div>
                        </div>
                    </div>
                </div>
              </card>  
            </div>
          </div>
        </div>
          <p />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getTopics, getTopicReplies, addReply, addTopic, closeTopic, reopenTopic } from '../services/TopicService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import BaseButton from '@/components/BaseButton';
import { getPlayer } from '../services/PlayerService';

export default ({
  name: 'LookingForYou',
  components: { QuillEditor, BaseButton },
  props: ['auth'],
  data() {
            return {
                current_player_id: 0,
                topics_filter: 1,
                show_new_topic_form: false,
                new_topic_name: "",
                new_topic_description: "",
                topics: [],
                expanded_topic: 0  ,
                new_reply: "",
                options: {
                debug: 'warn',
                modules: {
                  toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }], ['clean']]
                },
                readOnly: false,
                theme: 'snow'
              }
            }
        },
        async created () {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            this.url = window.location.href;
            getPlayer(this.email).then(response => {
                if (response.length > 0) 
                  this.current_player_id = response[0].id;
                getTopics(this.topics_filter).then(response => {
                    this.topics = response
                    });
                });
            },
  methods: {
    async login () {
      await this.$auth.signInWithRedirect({ originalUri: '/' })
    },
    async logout () {
      await this.$auth.signOut()
    },
    async changeExpansionStatus(topic_id) {
      if (topic_id == this.expanded_topic)
        this.expanded_topic = 0;
      else {
        this.expanded_topic = topic_id;  
        let topicToCheck = this.topics.find(topic => topic.id === topic_id);
        if (topicToCheck.replies_n > 0) 
          getTopicReplies(topic_id).then(replies => {
            this.topics.forEach(function(t) {if (t.id == topic_id) t.replies = replies;})
          });
      }
    },
    async addNewTopic() {
        const payload = {
          name: this.new_topic_name,
          description: this.new_topic_description,
          status_id: 1,
          author_id: this.current_player_id
        };
        addTopic(payload).then(() => {
            this.show_new_topic_form = false;
            this.topics_filter = 1;
            getTopics(this.topics_filter).then(response => {
                this.topics = response
            });
        });
        
    },
    async addReplyToTopic(topic_id) {
        const payload = {
              topic_id: topic_id,
              body: this.new_reply,
              author_id: this.current_player_id
            };
        let topicToUpdate = this.topics.find(topic => topic.id === topic_id); 
        topicToUpdate.replies_n++;
        let new_id = 10;
        if (topicToUpdate.replies_n > 1)
          new_id = topicToUpdate.replies[0].id - 1;
        else
          topicToUpdate.replies = [];      
        topicToUpdate.replies.push({
            id: new_id,
            body: this.new_reply,
            player_id: this.current_player_id,
            nickname: 'Me'
        });    
        addReply(topic_id, payload);  
        
        
    },
    async closeTopic(topic_id) {
        closeTopic(topic_id);
        let topicToUpdate = this.topics.find(topic => topic.id === topic_id);
        topicToUpdate.status_id = 2;
        if (this.expanded_topic === topic_id)
            this.expanded_topic = 0;  
    },
    async openTopic(topic_id) {
        reopenTopic(topic_id);
        let topicToUpdate = this.topics.find(topic => topic.id === topic_id);
        topicToUpdate.status_id = 1;
        if (this.expanded_topic === topic_id)
            this.expanded_topic = 0;
    },
    async reloadTopics(filter) {
        getTopics(filter).then(response => {
            this.topics = response
        });
        this.topics_filter = filter;      
    }
  }
})
</script>
