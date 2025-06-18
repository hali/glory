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
          <h1 class="display-3 text-white">
            {{ episode.name }}
          </h1>
        </div>
        <div class="row text-white">
          <p class="col-md-6">
            <strong>{{ $t("tags") }} </strong>
            <badge v-for="item in branches" :key="item.id" type="secondary">
              <router-link
                :to="{ name: 'episodes', query: { branch_id: item.id } }"
              >
                {{ item.description }}
              </router-link>
            </badge>
          </p>
          <p class="col-md-6">
            <strong>{{ $t("warnings") }} </strong> <badge type="secondary" />
          </p>
        </div>
        <div class="row text-white">
          <p class="col-md-6">
            <strong>{{ $t("storyTime") }}</strong> {{ episode.timeOfAction }}
          </p>
          <p class="col-md-6">
            <strong>{{ $t("world") }}</strong> {{ episode.world }}
          </p>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            <strong>{{ $t("authors") }}: </strong>
            <badge
              v-for="char in episode_characters"
              :key="char.id"
              type="secondary"
            >
              <router-link
                :to="{
                  name: 'viewcharacter',
                  params: { id: char.id },
                }"
              >
                {{ char.name }}
              </router-link>
            </badge>
          </p>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            <strong>{{ $t("storyDescription") }}</strong>
          </p>
          <div
            class="col-md-11 text-white"
            style="white-space: pre-wrap; text-justify: auto"
            type="light"
            v-html="episode.description"
          />
          <div class="col-md-6" align="left">
            <span
              v-if="current_player_id == episode.author_id"
              class="col-md-3"
              align="left"
              @click="
                $router.push({
                  name: 'editepisode',
                  params: { id: episode.id },
                })
              "
              ><base-button type="secondary">
                {{ $t("edit") }}
              </base-button></span
            >
            <span
              v-if="
                episode.status == 'Черновик' &&
                current_player_id == episode.author_id
              "
              class="col-md-3"
              align="left"
              @click="publishDraft()"
            >
              <base-button type="secondary">
                {{ $t("publish") }}
              </base-button></span
            >

            <span
              v-if="
                episode.status == 'В процессе' &&
                episode_players.includes(current_player_id)
              "
              class="col-md-3"
              @click="closeEpisode"
              ><base-button type="secondary">
                {{ $t("closeStory") }}
              </base-button></span
            >
            <span
              v-if="
                ['Завершен', 'Черновик'].includes(episode.status) &&
                episode_players.includes(current_player_id)
              "
              class="col-md-3"
              @click="reopenEpisode"
              ><base-button type="secondary">
                {{ $t("openStory") }}
              </base-button></span
            >
          </div>
          <div class="col-md-6" align="right">
            <base-button
              type="primary"
              class="mr-2"
              @click.prevent="exportToPDF()"
              :disabled="isExportingPDF"
            >
              <span v-if="!isExportingPDF">{{
                $t("exportToPDF") || "Export to PDF"
              }}</span>
              <span v-else>{{ $t("generating") || "Generating..." }}</span>
            </base-button>
            <base-button type="primary" @click.prevent="scrollToBottom()">
              {{ $t("bottom") }}
            </base-button>
          </div>
        </div>
        <div>
          <p />
          <div v-for="(item, index) in posts" :key="item.id">
            <card class="border-0" shadow body-classes="py-5" type="lighter">
              <div class="row">
                <div class="col-md-2" align="left">
                  <span>#{{ index + 1 }}</span>
                </div>
                <div class="col-md-10" align="right">
                  <span>{{ $t("posted") }}: {{ item.added_time }}</span>
                </div>
              </div>
              <div :id="'#' + item.id" class="row">
                <div class="col-md-2 card-profile-image">
                  <img :src="`${item.img}`" class="rounded-circle img-fluid" />
                </div>
                <div class="col-md-8" align="left">
                  <p>{{ item.name }}</p>
                  <p>{{ $t("currentAge") }}: {{ item.age }}</p>
                  <p>{{ item.status }}</p>
                </div>
                <div class="col-md-2" align="right">
                  <span
                    v-if="
                      episode.status == 'В процессе' &&
                      current_player_id == item.player_id
                    "
                    @click="
                      $router.push({
                        name: 'editpost',
                        params: { id: item.id },
                      })
                    "
                  >
                    <base-button
                      size="sm"
                      type="primary"
                      icon="fa fa-pencil"
                      title="Отредактировать"
                    />
                  </span>
                  <span
                    v-if="
                      index == posts.length - 1 &&
                      episode.status == 'В процессе' &&
                      current_player_id == item.player_id
                    "
                    @click="askForConfirmation(item.id)"
                  >
                    <base-button
                      size="sm"
                      type="primary"
                      icon="fa fa-trash"
                      title="Удалить пост"
                  /></span>
                  <span
                    v-if="current_player_id != item.player_id"
                    @click="addComment(item.id)"
                  >
                    <base-button
                      size="sm"
                      type="primary"
                      icon="fa fa-comment-o"
                      :title="$t('leaveFeedbackInstruction')"
                  /></span>
                </div>
              </div>
              <div
                style="white-space: pre-wrap; text-justify: auto"
                v-html="item.body"
              />
            </card>
            <p />
          </div>
        </div>
        <div class="row">
          <p />
          <div class="col-md-6" align="left">
            <base-button
              v-if="!subscription_status"
              type="info"
              @click.prevent="subscribe()"
            >
              {{ $t("subscribe") }}
            </base-button>
            <base-button
              v-if="subscription_status"
              type="info"
              @click.prevent="unsubscribe()"
            >
              {{ $t("unsubscribe") }}
            </base-button>
            <p />
          </div>
          <div class="col-md-6" align="right">
            <base-button type="primary" @click.prevent="scrollToTop()">
              {{ $t("top") }}
            </base-button>
            <p />
          </div>
        </div>
        <div v-if="episode.status == 'В процессе'" class="row">
          <div class="col-md-12">
            <quill-editor
              v-model:content="new_post"
              content-type="html"
              :options="options"
              class="form-control rounded-0"
              style="height: 250px"
              ref="myEditor"
            />
          </div>
        </div>
        <p />
        <div class="row">
          <p />
        </div>
        <div v-if="episode.status == 'В процессе'" class="row">
          <div class="col-md-6" align="left">
            <multiselect
              v-model="current_character"
              :options="characters"
              :searchable="true"
              :multiple="false"
              :close-on-select="true"
              label="name"
              track-by="id"
              :show-labels="false"
              :placeholder="$t('selectCharacter')"
            />
          </div>
          <div class="col-md-6" align="right">
            <span @click="addPost(current_character.id)">
              <base-button type="success">
                {{ $t("post") }}
              </base-button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {
  viewEpisode,
  getEpisodePosts,
  closeEpisode,
  reopenEpisode,
  getEpisodeBranches,
  updateEpisodeDraft,
  getEpisodeDraft,
  deleteEpisodeDraft,
} from "../services/EpisodeService";
import {
  sendNotificationNewPost,
  addSubscription,
  checkSubscription,
  deleteSubscription,
} from "../services/EmailService";
import { addPost, deletePost, addComment } from "../services/PostService";
import { getCharacters } from "../services/CharacterService";
import { getPlayer } from "../services/PlayerService";
import BaseButton from "@/components/BaseButton";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const UniqueSet = require("@sepiariver/unique-set");
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import "dotenv/config";
// Import jsPDF for PDF generation
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../assets/fonts/DejaVuSans-ExtraLight-normal.js";

export default {
  name: "ViewEpisode",
  components: { BaseButton, QuillEditor, Multiselect },
  data() {
    return {
      subscription_status: false,
      isExportingPDF: false,
      pdfContainer: null, // Reference to temporary PDF container
      episode: {
        id: this.$route.params.id,
        name: "",
        description: "",
        timeOfAction: "",
        world: "",
      },
      posts: [],
      branches: [],
      new_post: "",
      current_character: { id: 0, name: "  " },
      characters: [],
      episode_characters: [],
      episode_players: [],
      error: false,
      current_player_id: 0,
      email: "",
      url: "",
      options: {
        debug: "warn",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            ["clean"],
          ],
        },
        readOnly: false,
        theme: "snow",
      },
      timer: null,
    };
  },
  async created() {
    const idToken = await this.$auth.tokenManager.get("idToken");
    this.claims = await Object.entries(idToken.claims).map((entry) => ({
      key: entry[0],
      value: entry[1],
    }));
    this.claims.forEach((value) => {
      if (value.key == "email") this.email = value.value;
    });
    this.url = window.location.href;
    getPlayer(this.email).then((response) => {
      if (response.length > 0) this.current_player_id = response[0].id;
      getCharacters(this.current_player_id).then((characters) => {
        this.characters = characters;
      });
      viewEpisode(this.episode.id).then((response) => {
        this.episode.name = response[0].name;
        this.episode.description = response[0].description;
        this.episode.timeOfAction = new Date(response[0].timeOfAction)
          .toISOString()
          .split("T")[0];
        this.episode.collection = response[0].branch;
        this.episode.branch_id = response[0].branch_id;
        this.episode.world = response[0].world;
        this.episode.status = response[0].status;
        this.episode.author_id = response[0].author_id;
        document.title = response[0].name;
      });
      getEpisodePosts(this.episode.id).then((response) => {
        this.posts = response;
        this.episode_characters = [
          ...new UniqueSet(
            response.map((a) => ({ name: a.name, id: a.char_id }))
          ),
        ];
        this.episode_players = [
          ...new UniqueSet(response.map((a) => a.player_id)),
        ];
        if (location.hash) this.$nextTick(() => this.scrollToElement());
      });
      getEpisodeBranches(this.episode.id).then((response) => {
        this.branches = response;
      });
      getEpisodeDraft(this.episode.id, this.current_player_id).then(
        (response) => {
          if (response.length > 0) this.new_post = response[0].text;
        }
      );
      const subscription_payload = {
        episode_id: this.episode.id,
        player_id: this.current_player_id,
      };
      checkSubscription(subscription_payload).then((response) => {
        if (response[0].c == 1) this.subscription_status = true;
      });
    });
  },
  mounted() {
    this.timer = setInterval(() => {
      this.saveDraft();
    }, 20000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    // Clean up PDF container if it exists
    if (this.pdfContainer && this.pdfContainer.parentNode) {
      this.pdfContainer.parentNode.removeChild(this.pdfContainer);
    }
  },
  methods: {
    exportToPDF() {
      // Set loading state
      this.isExportingPDF = true;

      // Create a PDF export that renders text directly
      // The approach:
      // 1. First render episode meta info and add to PDF
      // 2. Then for each post, render and add to the same PDF

      const generatePDF = async () => {
        try {
          // Create a new PDF document with compression
          let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
            putOnlyUsedFonts: true,
          });
          // Set Unicode-compatible fonts
          doc.addFont(
            "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
            "DejaVuSans",
            "normal"
          );
          doc.addFont(
            "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf",
            "DejaVuSans",
            "bold"
          );
          doc.setFont("DejaVuSans", "normal");

          // Get page dimensions
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 10; // 10mm margins
          const contentWidth = pageWidth - 2 * margin;

          // Create the main container for the entire PDF
          const mainContainer = document.createElement("div");
          mainContainer.style.fontFamily = "DejaVuSans, Arial, sans-serif";
          mainContainer.style.width = contentWidth * 3.5 + "px"; // Convert to pixels for better rendering
          mainContainer.style.maxWidth = "100%";
          mainContainer.style.margin = "0";
          mainContainer.style.padding = "0";
          mainContainer.style.color = "#000000";
          mainContainer.style.backgroundColor = "#ffffff";
          mainContainer.style.lineHeight = "1.2";

          // STEP 1: Create meta info container
          const metaContainer = document.createElement("div");

          // Title
          const title = document.createElement("h1");
          title.textContent = this.episode.name;
          title.style.fontSize = "10px";
          title.style.fontWeight = "bold";
          title.style.textAlign = "center";
          title.style.marginBottom = "10px";
          metaContainer.appendChild(title);

          // Episode info
          if (this.episode.description) {
            const descTitle = document.createElement("h3");
            descTitle.textContent = "Description:";
            descTitle.style.fontSize = "8px";
            descTitle.style.fontWeight = "bold";
            descTitle.style.marginBottom = "3px";
            metaContainer.appendChild(descTitle);

            const descText = document.createElement("div");
            descText.innerHTML = this.episode.description;
            descText.style.fontSize = "7px";
            descText.style.lineHeight = "1.2";
            descText.style.whiteSpace = "pre-wrap";
            descText.style.marginBottom = "8px";
            metaContainer.appendChild(descText);
          }

          // Date of Action
          const dateTitle = document.createElement("h3");
          dateTitle.textContent = "Date of Action:";
          dateTitle.style.fontSize = "8px";
          dateTitle.style.fontWeight = "bold";
          dateTitle.style.marginBottom = "3px";
          metaContainer.appendChild(dateTitle);

          const dateText = document.createElement("p");
          dateText.textContent = this.episode.timeOfAction;
          dateText.style.fontSize = "7px";
          dateText.style.marginBottom = "8px";
          metaContainer.appendChild(dateText);

          // World
          const worldTitle = document.createElement("h3");
          worldTitle.textContent = "World:";
          worldTitle.style.fontSize = "8px";
          worldTitle.style.fontWeight = "bold";
          worldTitle.style.marginBottom = "3px";
          metaContainer.appendChild(worldTitle);

          const worldText = document.createElement("p");
          worldText.textContent = this.episode.world;
          worldText.style.fontSize = "7px";
          worldText.style.marginBottom = "8px";
          metaContainer.appendChild(worldText);

          // Notes
          if (this.episode.notes) {
            const notesTitle = document.createElement("h3");
            notesTitle.textContent = "Notes:";
            notesTitle.style.fontSize = "8px";
            notesTitle.style.fontWeight = "bold";
            notesTitle.style.marginBottom = "3px";
            metaContainer.appendChild(notesTitle);

            const notesText = document.createElement("p");
            notesText.innerHTML = this.episode.notes.replace(/\n/g, "<br>");
            notesText.style.fontSize = "7px";
            notesText.style.marginBottom = "8px";
            metaContainer.appendChild(notesText);
          }

          // First separator
          const firstSeparator = document.createElement("hr");
          firstSeparator.style.borderTop = "1px solid #888";
          firstSeparator.style.margin = "6px 0";
          metaContainer.appendChild(firstSeparator);

          // Characters
          const charsTitle = document.createElement("h2");
          charsTitle.textContent = "Characters:";
          charsTitle.style.fontSize = "9px";
          charsTitle.style.fontWeight = "bold";
          charsTitle.style.marginBottom = "5px";
          metaContainer.appendChild(charsTitle);

          // Add each character with age
          this.episode_characters.forEach((char) => {
            const charPost = this.posts.find(
              (post) => post.char_id === char.id
            );
            const age = charPost ? charPost.age : "Unknown";

            const charText = document.createElement("p");
            charText.textContent = `${char.name} (Age: ${age})`;
            charText.style.fontSize = "7px";
            charText.style.marginBottom = "3px";
            metaContainer.appendChild(charText);
          });

          // Second separator
          const secondSeparator = document.createElement("hr");
          secondSeparator.style.borderTop = "1px solid #888";
          secondSeparator.style.margin = "6px 0";
          metaContainer.appendChild(secondSeparator);

          // Add meta container to main container
          mainContainer.appendChild(metaContainer);

          // STEP 2: Create post containers
          for (let index = 0; index < this.posts.length; index++) {
            const post = this.posts[index];

            // Force page break before each post
            const pageBreak = document.createElement("div");
            pageBreak.style.pageBreakBefore = "always";
            mainContainer.appendChild(pageBreak);

            // Create post container
            const postContainer = document.createElement("div");
            postContainer.style.marginTop = "10px";

            // Character name
            const nameHeading = document.createElement("h3");
            nameHeading.textContent = `${post.name}:`;
            nameHeading.style.fontSize = "8px";
            nameHeading.style.fontWeight = "bold";
            nameHeading.style.marginBottom = "3px";
            postContainer.appendChild(nameHeading);

            // Post body
            const bodyDiv = document.createElement("div");
            // Clean up any HTML tags in the body, minimize text processing
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = post.body.replace(
              /<(?!\/?br|\/?p)[^>]+>/gi,
              ""
            );
            const cleanText =
              tempDiv.textContent || tempDiv.innerText || post.body;

            bodyDiv.textContent = cleanText;
            bodyDiv.style.fontSize = "7px";
            bodyDiv.style.lineHeight = "1.2";
            bodyDiv.style.whiteSpace = "pre-wrap";
            bodyDiv.style.wordBreak = "break-word";
            bodyDiv.style.textAlign = "left";
            bodyDiv.style.padding = "0";
            postContainer.appendChild(bodyDiv);

            // Add separator between posts (except for the last one)
            if (index < this.posts.length - 1) {
              const separator = document.createElement("div");
              separator.textContent = "***";
              separator.style.textAlign = "center";
              separator.style.margin = "6px 0";
              separator.style.fontSize = "7px";
              postContainer.appendChild(separator);
            }

            // Add post container to main container
            mainContainer.appendChild(postContainer);
          }

          // Add the main container to document body temporarily (required for jsPDF.html)
          document.body.appendChild(mainContainer);
          this.pdfContainer = mainContainer;

          // Generate sanitized filename
          let sanitizedName = this.episode.name
            .replace(/[^a-z0-9а-яА-Я]/gi, "_")
            .replace(/_+/g, "_")
            .toLowerCase();

          // Make sure filename isn't empty or too long
          if (!sanitizedName || sanitizedName.length < 3) {
            sanitizedName = "episode_" + this.episode.id;
          } else if (sanitizedName.length > 50) {
            sanitizedName = sanitizedName.substring(0, 50);
          }

          const filename = `${sanitizedName}.pdf`;

          // Direct PDF text rendering instead of using HTML conversion
          // This drastically reduces file size

          // First, add meta info
          let y = margin;

          // Title
          doc.setFontSize(14);
          doc.setFont("DejaVuSans", "bold");
          doc.text(this.episode.name, pageWidth / 2, (y += 10), {
            align: "center",
            maxWidth: pageWidth - 2 * margin,
          });
          y += 8;

          // Description
          if (this.episode.description) {
            doc.setFontSize(10);
            doc.setFont("DejaVuSans", "bold");
            doc.text("Description:", margin, (y += 5));
            y += 3;

            doc.setFontSize(9);
            doc.setFont("DejaVuSans", "normal");
            // Preserve newlines in description
            const descText = this.episode.description.replace(/\r\n/g, "\n");
            const descLines = doc.splitTextToSize(
              descText,
              pageWidth - 2 * margin - 5
            );
            doc.text(descLines, margin, y);
            y += descLines.length * 4.5 + 5;
          }

          // Date of Action
          doc.setFontSize(10);
          doc.setFont("DejaVuSans", "bold");
          doc.text("Date of Action:", margin, (y += 5));
          y += 3;

          doc.setFontSize(9);
          doc.setFont("DejaVuSans", "normal");
          doc.text(this.episode.timeOfAction, margin, y);
          y += 7;

          // World
          doc.setFontSize(10);
          doc.setFont("DejaVuSans", "bold");
          doc.text("World:", margin, y);
          y += 3;

          doc.setFontSize(9);
          doc.setFont("DejaVuSans", "normal");
          doc.text(this.episode.world, margin, y);
          y += 7;

          // Notes
          if (this.episode.notes) {
            doc.setFontSize(10);
            doc.setFont("DejaVuSans", "bold");
            doc.text("Notes:", margin, y);
            y += 3;

            doc.setFontSize(9);
            doc.setFont("DejaVuSans", "normal");

            // Preserve newlines from original notes
            const notesText = this.episode.notes.replace(/\r\n/g, "\n");
            const notesLines = doc.splitTextToSize(
              notesText,
              pageWidth - 2 * margin - 5
            );
            doc.text(notesLines, margin, y);
            y += notesLines.length * 4.5 + 5;
          }

          // Characters
          doc.setFontSize(10);
          doc.setFont("DejaVuSans", "bold");
          doc.text("Characters:", margin, y);
          y += 5;

          // Add each character with age
          this.episode_characters.forEach((char) => {
            const charPost = this.posts.find(
              (post) => post.char_id === char.id
            );
            const age = charPost ? charPost.age : "Unknown";

            doc.setFontSize(9);
            doc.setFont("DejaVuSans", "normal");
            doc.text(`${char.name} (Age: ${age})`, margin, y);
            y += 4.5;

            // Check for page overflow and create new page if needed
            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin + 10;
            }
          });

          // Process each post
          for (let index = 0; index < this.posts.length; index++) {
            const post = this.posts[index];

            // Always start a new page for each post (first post after meta info already on a new page)
            doc.addPage();
            y = margin + 10;

            // Character name
            doc.setFontSize(10);
            doc.setFont("DejaVuSans", "bold");
            doc.text(`${post.name}:`, margin, y);
            y += 5;

            // Post body - clean up HTML while preserving newlines
            // Post body - clean up HTML while preserving newlines
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = post.body
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/<p>/gi, "")
              .replace(/<\/p>/gi, "\n\n");
            const cleanText = (
              tempDiv.textContent ||
              tempDiv.innerText ||
              post.body
            ).replace(/\r\n/g, "\n"); // Normalize all newlines

            // Split long text into lines that fit the page width
            doc.setFontSize(9);
            doc.setFont("DejaVuSans", "normal");
            const textLines = doc.splitTextToSize(
              cleanText,
              pageWidth - 2 * margin - 5
            );

            // Add lines with pagination
            let lineIndex = 0;
            while (lineIndex < textLines.length) {
              // Calculate how many lines will fit on current page
              const linesRemaining = Math.floor(
                (pageHeight - y - margin) / 4.5
              );
              const linesToRender = Math.min(
                linesRemaining,
                textLines.length - lineIndex
              );

              if (linesToRender <= 0) {
                // No space left, add a new page
                doc.addPage();
                y = margin + 10;
                continue;
              }

              // Add text for this page
              const pageText = textLines.slice(
                lineIndex,
                lineIndex + linesToRender
              );
              doc.text(pageText, margin, y);

              // Update position
              lineIndex += linesToRender;
              y += linesToRender * 4.5;

              // Add a new page if more text remains
              if (lineIndex < textLines.length) {
                doc.addPage();
                y = margin + 10;
              }
            }
          }

          // Add page numbers
          const totalPages = doc.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont("DejaVuSans", "normal");
            doc.text(
              `Page ${i} of ${totalPages}`,
              pageWidth / 2,
              pageHeight - 5,
              { align: "center" }
            );
          }

          // Save the PDF
          doc.save(filename);

          // Clean up - remove the temporary container
          if (this.pdfContainer && this.pdfContainer.parentNode) {
            this.pdfContainer.parentNode.removeChild(this.pdfContainer);
            this.pdfContainer = null;
          }
        } catch (error) {
          console.error("Error generating PDF:", error);
          alert("There was an error generating the PDF. Please try again.");
        } finally {
          // Reset loading state
          this.isExportingPDF = false;

          // Clean up in case of error
          if (this.pdfContainer && this.pdfContainer.parentNode) {
            this.pdfContainer.parentNode.removeChild(this.pdfContainer);
            this.pdfContainer = null;
          }
        }
      };

      // Execute the PDF generation
      generatePDF();
    },

    scrollToElement() {
      if (location.hash)
        document.getElementById(location.hash).scrollIntoView();
    },
    saveDraft() {
      let processed_text = this.new_post
        .replaceAll("-- ", "— ")
        .replaceAll("- ", "— ")
        .replaceAll("  ", " ");
      const payload = {
        draft: processed_text,
        player_id: this.current_player_id,
      };
      if (processed_text.length > 15)
        updateEpisodeDraft(this.episode.id, payload);
    },
    addPost(character) {
      let processed_text = this.new_post
        .replaceAll("-- ", "— ")
        .replaceAll("- ", "— ")
        .replaceAll("  ", " ");
      const payload = {
        body: processed_text,
        added_time: new Date().toISOString().slice(0, 19).replace("T", " "),
        episode_id: this.episode.id,
        author_id: character,
      };
      addPost(payload).then((status) => {
        this.error = status > 299;
        if (!this.error) {
          deleteEpisodeDraft(this.episode.id, this.current_player_id);
          this.$refs.myEditor.setHTML("");
          getEpisodePosts(this.episode.id).then((response) => {
            this.posts = response;
            const notificationPayload = {
              thread_name: this.episode.name,
              episode_id: this.episode.id,
              character_name: this.current_character.name,
              thread_url: this.url,
              post_text: processed_text,
              player_id: this.current_player_id,
            };

            sendNotificationNewPost(notificationPayload);
          });
        }
      });
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    scrollToBottom() {
      window.scrollTo(0, document.body.scrollHeight);
    },
    closeEpisode() {
      closeEpisode(this.episode.id).then(() => {
        this.$router.go();
      });
    },
    publishDraft() {
      reopenEpisode(this.episode.id).then(() => {
        this.$router.go();
      });
    },
    reopenEpisode() {
      reopenEpisode(this.episode.id).then(() => {
        this.$router.go();
      });
    },
    askForConfirmation(postId) {
      if (confirm("Правда удалить пост?")) {
        deletePost(postId).then(() => {
          getEpisodePosts(this.episode.id).then((response) => {
            this.posts = response;
          });
        });
      }
    },
    subscribe() {
      const payload = {
        episode_id: this.episode.id,
        player_id: this.current_player_id,
      };
      addSubscription(payload).then(() => (this.subscription_status = true));
    },
    unsubscribe() {
      const payload = {
        episode_id: this.episode.id,
        player_id: this.current_player_id,
      };
      deleteSubscription(payload).then(
        () => (this.subscription_status = false)
      );
    },
    addComment(postId) {
      let comment = prompt("Введите текст комментария");
      if (comment != null || comment != "") {
        const payload = {
          post_id: postId,
          body: comment,
          author_id: this.current_player_id,
        };
        addComment(postId, payload);
      }
    },
  },
};
</script>
<style></style>
