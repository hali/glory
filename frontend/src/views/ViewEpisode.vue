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
// Import html2canvas for rendering Unicode text
import html2canvas from "html2canvas";

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

      // Create a PDF export that handles Unicode text and large content
      // The approach:
      // 1. First render episode meta info and add to PDF
      // 2. Then for each post, render and add to the same PDF

      const generatePDF = async () => {
        try {
          // Create a new PDF document
          let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          // Get page dimensions
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 20; // 20mm margins

          // Create a temporary container to render content
          // We'll use this to generate HTML that will be converted to images
          const container = document.createElement("div");
          container.style.position = "absolute";
          container.style.left = "-9999px";
          container.style.width = pageWidth - 2 * margin + "mm";
          container.style.fontFamily = "Arial, Helvetica, sans-serif";
          container.style.padding = "0";
          container.style.margin = "0";
          container.style.backgroundColor = "#ffffff";
          // Avoid line breaking issues by adding a slight line spacing
          container.style.lineHeight = "1.5";
          document.body.appendChild(container);
          this.pdfContainer = container;

          // Helper function to create styled HTML elements
          const createStyledElement = (tag, text, style = {}) => {
            const element = document.createElement(tag);
            // Convert HTML content to preserve newlines
            if (typeof text === "string") {
              const tempDiv = document.createElement("div");
              // Convert BR tags to newlines before setting innerHTML
              tempDiv.innerHTML = text
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<p>/gi, "")
                .replace(/<\/p>/gi, "\n\n");

              // Use innerHTML for div elements to preserve formatting
              if (tag === "div") {
                element.innerHTML = tempDiv.innerHTML;
                // Set whiteSpace property to preserve newlines
                element.style.whiteSpace = "pre-wrap";
              } else {
                element.textContent =
                  tempDiv.textContent || tempDiv.innerText || text;
              }
            } else {
              element.textContent = text;
            }

            Object.assign(element.style, {
              margin: "0",
              padding: "0",
              width: "100%",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              wordBreak: "break-word",
              maxWidth: "100%",
              boxSizing: "border-box",
              ...style,
            });

            return element;
          };

          // Helper function to add a section to our container
          const addSection = (elements) => {
            const section = document.createElement("div");
            section.style.marginBottom = "15px";
            section.style.width = "100%";
            section.style.boxSizing = "border-box";
            section.style.overflowWrap = "break-word";
            section.style.whiteSpace = "pre-wrap"; // Preserve newlines
            elements.forEach((element) => section.appendChild(element));
            container.appendChild(section);
            return section;
          };

          // Helper function to add a separator
          const addSeparator = () => {
            const hr = document.createElement("hr");
            hr.style.border = "none";
            hr.style.borderTop = "1px solid #888";
            hr.style.margin = "15px 0";
            container.appendChild(hr);
          };

          // Title
          addSection([
            createStyledElement("h1", this.episode.name, {
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }),
          ]);

          // Episode info
          if (this.episode.description) {
            addSection([
              createStyledElement("h3", "Description:", {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement("div", this.episode.description, {
                fontSize: "14px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
                textAlign: "left",
              }),
            ]);
          }

          addSection([
            createStyledElement("h3", "Date of Action:", {
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "5px",
            }),
            createStyledElement("p", this.episode.timeOfAction, {
              fontSize: "14px",
            }),
          ]);

          addSection([
            createStyledElement("h3", "World:", {
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "5px",
            }),
            createStyledElement("p", this.episode.world, { fontSize: "14px" }),
          ]);

          if (this.episode.notes) {
            addSection([
              createStyledElement("h3", "Notes:", {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement("p", this.episode.notes, {
                fontSize: "14px",
              }),
            ]);
          }

          // First separator
          addSeparator();

          // Characters
          addSection([
            createStyledElement("h2", "Characters:", {
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }),
          ]);

          // Add each character with age
          this.episode_characters.forEach((char) => {
            const charPost = this.posts.find(
              (post) => post.char_id === char.id
            );
            const age = charPost ? charPost.age : "Unknown";

            addSection([
              createStyledElement("p", `${char.name} (Age: ${age})`, {
                fontSize: "14px",
                marginBottom: "5px",
              }),
            ]);
          });

          // Second separator
          addSeparator();

          // Posts are now handled separately in the second part of the PDF generation

          // Generate the PDF in two stages:
          // 1. First render and add the episode meta info
          // 2. Then render and add each post

          // Helper function to add canvas to PDF
          // Takes multiple canvases to handle large content that's been split
          const addCanvasToPDF = async (
            canvases,
            doc,
            pageWidth,
            pageHeight,
            margin,
            isNewPage = false,
            returnPageCount = false
          ) => {
            // Process each canvas and add to PDF
            const initialPageNumber = doc.internal.getNumberOfPages();

            // For each canvas (we might have multiple if content was split)
            for (
              let canvasIndex = 0;
              canvasIndex < canvases.length;
              canvasIndex++
            ) {
              const canvas = canvases[canvasIndex];

              // Get the canvas dimensions
              const contentWidth = canvas.width;
              const contentHeight = canvas.height;

              // Calculate how many pages we need
              const pdfWidth = pageWidth - 2 * margin;
              const pdfHeight = pageHeight - 2 * margin;

              // Convert px to mm ratio (adjusting for margins)
              const pxToMmRatio = contentWidth / pdfWidth;
              const contentHeightInMm = contentHeight / pxToMmRatio;

              // Calculate number of pages needed for this canvas
              const pagesForThisCanvas = Math.max(
                1,
                Math.ceil(contentHeightInMm / pdfHeight)
              );

              // Add each section of the canvas as a new page
              for (let i = 0; i < pagesForThisCanvas; i++) {
                // For pages after the first, add a new page
                if (i > 0 || canvasIndex > 0 || isNewPage) {
                  doc.addPage();
                }

                // Calculate which part of the canvas to use for this page
                const canvasSectionHeight = pdfHeight * pxToMmRatio;
                // Apply an overlap between pages to prevent text clipping
                const overlap = 5; // Increased overlap to prevent text clipping at boundaries
                const sourceY = Math.max(
                  0,
                  i * canvasSectionHeight - (i > 0 ? overlap : 0)
                );
                let sectionHeight = canvasSectionHeight + (i > 0 ? overlap : 0);

                // If it's the last section, it might not be a full page
                if (sourceY + sectionHeight > contentHeight) {
                  sectionHeight = contentHeight - sourceY;
                }

                // Only add image if there's content to add
                if (sectionHeight > 0) {
                  try {
                    // Create a temporary canvas for this section
                    const sectionCanvas = document.createElement("canvas");
                    sectionCanvas.width = contentWidth;
                    sectionCanvas.height = sectionHeight;
                    const ctx = sectionCanvas.getContext("2d");

                    // Draw the appropriate section of the original canvas
                    ctx.drawImage(
                      canvas,
                      0,
                      sourceY,
                      contentWidth,
                      sectionHeight,
                      0,
                      0,
                      contentWidth,
                      sectionHeight
                    );

                    // Add this section to the PDF - use JPEG with lower quality to avoid string length errors
                    const imgData = sectionCanvas.toDataURL("image/jpeg", 0.8);
                    // For pages after the first, adjust the placement to account for overlap
                    const yOffset = i > 0 ? overlap / pxToMmRatio : 0;
                    doc.addImage(
                      imgData,
                      "JPEG",
                      margin,
                      margin - yOffset,
                      pdfWidth,
                      Math.min(pdfHeight + yOffset, sectionHeight / pxToMmRatio)
                    );
                  } catch (err) {
                    console.error("Error adding section to PDF:", err);
                    // Skip this section but continue with the rest
                  }
                }
              }
            }

            // Add page numbers after all content is added
            const finalPageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= finalPageCount; i++) {
              doc.setPage(i);
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text(
                `Page ${doc.internal.getNumberOfPages()}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
              );
            }

            // Calculate how many pages were actually added
            const actualPageCount =
              doc.internal.getNumberOfPages() - initialPageNumber;
            if (isNewPage && actualPageCount === 0) {
              // If we requested a new page but none was added (empty content),
              // still add a page to ensure separation
              doc.addPage();
            }

            return returnPageCount ? { doc, pageCount: actualPageCount } : doc;
          };

          // Helper function to prepare element for canvas conversion
          const prepareForCanvas = (clonedDoc, containerSelector) => {
            const clonedContainer =
              clonedDoc.body.querySelector(containerSelector);
            if (clonedContainer) {
              const allTextElements =
                clonedContainer.querySelectorAll("div, p, span");
              allTextElements.forEach((el) => {
                el.style.whiteSpace = "pre-wrap";
                // Ensure text doesn't break at inconvenient places
                el.style.lineHeight = "1.5";
                el.style.pageBreakInside = "avoid";
                el.style.breakInside = "avoid";
              });
            }
          };

          // Step 1: Render and add episode meta info
          // Clear container first
          container.innerHTML = "";

          // Add episode meta info
          // Title
          addSection([
            createStyledElement("h1", this.episode.name, {
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }),
          ]);

          // Episode info
          if (this.episode.description) {
            addSection([
              createStyledElement("h3", "Description:", {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement("div", this.episode.description, {
                fontSize: "14px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
                textAlign: "left",
              }),
            ]);
          }

          addSection([
            createStyledElement("h3", "Date of Action:", {
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "5px",
            }),
            createStyledElement("p", this.episode.timeOfAction, {
              fontSize: "14px",
            }),
          ]);

          addSection([
            createStyledElement("h3", "World:", {
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "5px",
            }),
            createStyledElement("p", this.episode.world, { fontSize: "14px" }),
          ]);

          if (this.episode.notes) {
            addSection([
              createStyledElement("h3", "Notes:", {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement("p", this.episode.notes, {
                fontSize: "14px",
              }),
            ]);
          }

          // First separator
          addSeparator();

          // Characters
          addSection([
            createStyledElement("h2", "Characters:", {
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }),
          ]);

          // Add each character with age
          this.episode_characters.forEach((char) => {
            const charPost = this.posts.find(
              (post) => post.char_id === char.id
            );
            const age = charPost ? charPost.age : "Unknown";

            addSection([
              createStyledElement("p", `${char.name} (Age: ${age})`, {
                fontSize: "14px",
                marginBottom: "5px",
              }),
            ]);
          });

          // Second separator
          addSeparator();

          // Function to split large content into smaller canvases
          // This prevents "RangeError: Invalid string length" by breaking large content
          // into manageable chunks that don't exceed JavaScript string size limits
          const generateCanvases = async (
            contentContainer,
            maxHeight = 4000
          ) => {
            // Get total height of content
            const totalHeight = contentContainer.offsetHeight;
            const width = contentContainer.offsetWidth;

            // If content is small enough, just return one canvas
            if (totalHeight <= maxHeight) {
              const canvas = await html2canvas(contentContainer, {
                scale: 1.5, // Lower scale for better performance and to avoid memory issues
                useCORS: true,
                logging: false,
                allowTaint: true,
                letterRendering: true,
                width: width,
                height: totalHeight,
                onclone: (clonedDoc) => {
                  prepareForCanvas(clonedDoc, "[style*='position: absolute']");
                },
              });
              return [canvas];
            }

            // Otherwise split into multiple canvases
            const canvases = [];
            const segments = Math.ceil(totalHeight / maxHeight);

            for (let i = 0; i < segments; i++) {
              // Create a clone of the container for this segment
              const segmentContainer = contentContainer.cloneNode(true);
              document.body.appendChild(segmentContainer);

              // Position to show only the relevant part
              const yStart = i * maxHeight;
              segmentContainer.style.position = "absolute";
              segmentContainer.style.top = `-${yStart}px`;
              segmentContainer.style.height = `${totalHeight}px`;
              segmentContainer.style.clip = `rect(${yStart}px, ${width}px, ${Math.min(
                yStart + maxHeight,
                totalHeight
              )}px, 0)`;

              // Generate canvas for this segment
              try {
                const canvas = await html2canvas(segmentContainer, {
                  scale: 1.5,
                  useCORS: true,
                  logging: false,
                  allowTaint: true,
                  letterRendering: true,
                  width: width,
                  height: Math.min(maxHeight, totalHeight - yStart),
                  y: yStart,
                  onclone: (clonedDoc) => {
                    prepareForCanvas(
                      clonedDoc,
                      "[style*='position: absolute']"
                    );
                  },
                });
                canvases.push(canvas);
              } catch (err) {
                console.error("Error generating canvas segment:", err);
              }

              // Clean up
              document.body.removeChild(segmentContainer);
            }

            return canvases;
          };

          // STEP 1: Generate and add meta info to PDF
          const metaCanvases = await generateCanvases(container);

          // Add meta info to PDF
          const { doc: updatedDoc } = await addCanvasToPDF(
            metaCanvases,
            doc,
            pageWidth,
            pageHeight,
            margin,
            false,
            true
          );

          // Use the updated doc with meta info
          doc = updatedDoc;

          // STEP 2: Render and add each post
          // Process each post one by one, always starting each on a new page
          for (let index = 0; index < this.posts.length; index++) {
            const post = this.posts[index];

            // Clear container for this post
            container.innerHTML = "";

            // Character name
            addSection([
              createStyledElement("h3", `${post.name}:`, {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement("div", post.body, {
                fontSize: "14px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
                wordBreak: "break-word",
                textAlign: "left",
                padding: "0",
                display: "block",
              }),
            ]);

            // Add extra padding at the bottom to prevent content cutoff
            const paddingDiv = document.createElement("div");
            paddingDiv.style.height = "200px";
            paddingDiv.style.width = "100%";
            container.appendChild(paddingDiv);

            // Generate post canvases - split large posts into multiple canvases to prevent string length errors
            const postCanvases = await generateCanvases(container);

            // Add post to the PDF - always start each post on a new page
            const { doc: updatedPostDoc } = await addCanvasToPDF(
              postCanvases,
              doc,
              pageWidth,
              pageHeight,
              margin,
              true, // true = start on a new page
              true
            );
            // Update the doc reference
            doc = updatedPostDoc;
          }

          // Generate sanitized filename
          // Generate a safe filename from the episode name
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

          // Save the PDF
          doc.save(filename);

          // PDF is now downloaded to the user's device

          // Clean up memory to avoid leaks
          if (this.pdfContainer && this.pdfContainer.parentNode) {
            this.pdfContainer.parentNode.removeChild(this.pdfContainer);
            this.pdfContainer = null;
          }

          // Force garbage collection if possible to free memory after large PDF generation
          if (window.gc) {
            window.gc();
          } else if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              // This gives the browser a hint to perform GC when idle
              // Creating and discarding a large array can encourage garbage collection
              new Array(100).fill("x").join("");
            });
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
