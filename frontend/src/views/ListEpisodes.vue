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
    <div class="container">
      <div class="row text-white">
        <h1 class="display-3 text-white">
          {{ $t("stories") }} ({{ filteredEpisodes.length }})
        </h1>
      </div>
      <div class="row">
        <div class="col-md-3">
          <multiselect
            v-model="current_status"
            :options="status_filter"
            :searchable="true"
            :multiple="false"
            :close-on-select="true"
            label="status"
            track-by="id"
            :show-labels="false"
            @select="selectStatus"
          />
        </div>
        <div class="col-md-6">
          <badge
            v-if="selectedBranches.length > 0"
            type="primary"
            @click="clearBranchFilters"
          >
            {{ $t("clearAllFilters") || "Clear all filters" }}
          </badge>
          <badge
            v-if="player_id != 0 && filteredByPlayer == false"
            type="primary"
            @click="filterByPlayer"
          >
            {{ $t("showMyStories") }}
          </badge>
          <badge
            v-if="filteredByPlayer"
            type="primary"
            @click="clearPlayerFilter"
          >
            {{ $t("stopFilteringByMine") }}
          </badge>
        </div>
        <div class="col-md-3 text-right">
          <base-button
            type="primary"
            @click="exportToPDF"
            :disabled="isExportingPDF || filteredEpisodes.length === 0"
          >
            <span v-if="!isExportingPDF">{{
              $t("exportAllToPDF") || "Export All to PDF"
            }}</span>
            <span v-else
              >{{ $t("generating") || "Generating..." }}
              {{ exportProgress }}</span
            >
          </base-button>
        </div>
      </div>

      <!-- Tag Cloud for Branches -->
      <div class="tag-cloud mt-3 mb-3">
        <badge
          v-for="branch in allBranches"
          :key="branch.id"
          :type="isBranchSelected(branch.id) ? 'success' : 'primary'"
          :class="{ 'selected-branch': isBranchSelected(branch.id) }"
          @click="toggleBranchFilter(branch.id)"
        >
          {{ branch.description }}
          <span v-if="isBranchSelected(branch.id)" class="badge-counter">
            <i class="fa fa-check"></i>
          </span>
        </badge>
      </div>
      <card>
        <div v-if="filteredEpisodes.length == 0">
          {{ $t("noStoriesSorry") }}
        </div>
        <table class="table table-bordered">
          <tbody>
            <tr v-for="item in paginatedEpisodes" :key="item.id">
              <td>
                <router-link
                  :to="{
                    name: 'viewepisode',
                    params: { id: item.id },
                  }"
                >
                  {{ item.name }} ({{ item.dateOfAction }})
                </router-link>
                <div>
                  <badge
                    v-for="branch in item.branches"
                    :key="branch.id"
                    :type="isBranchSelected(branch.id) ? 'success' : 'primary'"
                    @click="toggleBranchFilter(branch.id)"
                  >
                    {{ branch.description }}
                  </badge>
                  <badge
                    v-if="item.status == 'Заброшен'"
                    type="danger"
                    @click="filterByStatus(1, 'Заброшен')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'Завершен'"
                    type="success"
                    @click="filterByStatus(2, 'Завершен')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'В процессе'"
                    type="default"
                    @click="filterByStatus(3, 'В процессе')"
                  >
                    {{ item.status }}
                  </badge>
                  <badge
                    v-if="item.status == 'Черновик'"
                    type="info"
                    @click="filterByStatus(4, 'Черновик')"
                  >
                    {{ item.status }}
                  </badge>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination controls -->
        <div
          class="pagination-container mt-3 d-flex justify-content-between align-items-center"
        >
          <div class="page-info">
            {{ $t("showing") || "Showing" }} {{ paginationStart + 1 }}-{{
              Math.min(paginationStart + pageSize, filteredEpisodes.length)
            }}
            {{ $t("of") || "of" }} {{ filteredEpisodes.length }}
          </div>
          <div class="pagination-controls">
            <button
              class="btn btn-sm btn-primary mr-2"
              @click="prevPage"
              :disabled="currentPage === 1"
              aria-label="Previous page"
            >
              <i class="fa fa-chevron-left"></i>
            </button>
            <span class="mx-2"
              >{{ $t("page") || "Page" }} {{ currentPage }}
              {{ $t("of") || "of" }} {{ totalPages }}</span
            >
            <button
              class="btn btn-sm btn-primary ml-2"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              aria-label="Next page"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </card>
    </div>
  </section>
</template>
<script>
import {
  getEpisodes,
  getAllBranches,
  viewEpisode,
  getEpisodePosts,
} from "../services/EpisodeService";
import { getEpisodesByPlayerId, getPlayer } from "../services/PlayerService";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import BaseButton from "@/components/BaseButton";
import html2canvas from "html2canvas";
const UniqueSet = require("@sepiariver/unique-set");

export default {
  name: "EpisodesList",
  components: { Multiselect, BaseButton },
  props: [],
  data() {
    return {
      episodes: [],
      allEpisodes: [], // Store all episodes for client-side filtering
      filteredEpisodes: [], // Store filtered episodes for pagination
      allBranches: [],
      selectedBranches: [], // Array of selected branch IDs for multi-tag filtering
      branch_id: 0,
      branch_name: "Все коллекции",
      email: "",
      player_id: 0,
      filteredByPlayer: false,
      status_filter: [
        { id: 0, status: "Всё подряд" },
        { id: 3, status: "В процессе" },
        { id: 2, status: "Завершён" },
        { id: 4, status: "Черновик" },
      ],
      current_status: { id: 0, status: "Всё подряд" },
      // Pagination
      currentPage: 1,
      pageSize: 25,
      // PDF Export
      isExportingPDF: false,
      pdfTitle: "",
      exportProgress: "",
      pdfContainer: null, // Reference to temporary PDF container
    };
  },
  // Computed properties for pagination
  computed: {
    // Calculate total number of pages
    totalPages() {
      return Math.ceil(this.filteredEpisodes.length / this.pageSize);
    },
    // Get current page of episodes
    paginatedEpisodes() {
      const start = this.paginationStart;
      const end = start + this.pageSize;
      return this.filteredEpisodes.slice(start, end);
    },
    // Calculate starting index for pagination
    paginationStart() {
      return (this.currentPage - 1) * this.pageSize;
    },
  },
  beforeUnmount() {
    // Clean up PDF container if it exists
    if (this.pdfContainer && this.pdfContainer.parentNode) {
      this.pdfContainer.parentNode.removeChild(this.pdfContainer);
      this.pdfContainer = null;
    }
  },
  async created() {
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    document.title = "Glory - Эпизоды";
    if (params.get("branch_id")) this.branch_id = params.get("branch_id");
    // Always load all branches for the tag cloud
    getAllBranches().then((allBranches) => {
      this.allBranches = allBranches;

      // Check for URL parameter for branch_id
      if (params.get("branch_id")) {
        this.branch_id = parseInt(params.get("branch_id"));
        if (this.branch_id !== 0) {
          // Add the branch from URL to selected branches
          this.selectedBranches = [this.branch_id];
          this.branch_name =
            this.allBranches.filter((item) => item.id == this.branch_id)[0]
              ?.description || "Unknown";
        }
      }

      // Load episodes and apply filters
      this.applyFilters();
    });
    if (
      this.authState &&
      this.authState.isAuthenticated &&
      this.branch_id == 0
    ) {
      const idToken = await this.$auth.tokenManager.get("idToken");
      this.claims = await Object.entries(idToken.claims).map((entry) => ({
        key: entry[0],
        value: entry[1],
      }));
      this.claims.forEach((value) => {
        if (value.key == "email") this.email = value.value;
      });
      if (this.email != "") {
        getPlayer(this.email).then((response) => {
          this.player_id = response[0].id;
          getEpisodesByPlayerId(this.player_id, this.current_status.id).then(
            (response) => {
              this.episodes = response;
              getAllBranches().then((allBranches) => {
                this.allBranches = allBranches;
                this.filteredByPlayer = true;
                this.episodes.forEach((ep, i) => {
                  if (ep.branch_ids !== null) {
                    const branchIdsArray = ep.branch_ids
                      .split(",")
                      .map((id) => parseInt(id));
                    const branches = this.allBranches.filter((item) =>
                      branchIdsArray.includes(item.id)
                    );
                    this.episodes[i].branches = branches;
                  }
                });
              });
            }
          );
        });
      }
    }
    if (
      !(this.authState && this.authState.isAuthenticated) &&
      this.branch_id == 0
    ) {
      getEpisodes(this.current_status.id, this.branch_id).then((response) => {
        this.episodes = response;
        getAllBranches().then((allBranches) => {
          this.allBranches = allBranches;
          this.episodes.forEach((ep, i) => {
            if (ep.branch_ids !== null) {
              const branchIdsArray = ep.branch_ids
                .split(",")
                .map((id) => parseInt(id));
              const branches = this.allBranches.filter((item) =>
                branchIdsArray.includes(item.id)
              );
              this.episodes[i].branches = branches;
            }
          });
        });
      });
    }
  },
  methods: {
    selectStatus() {
      if (this.filteredByPlayer) {
        this.filterByPlayer();
      } else {
        this.applyFilters();
      }
    },
    filterByStatus(id, status) {
      this.current_status = { id: id, status: status };
      this.selectStatus();
    },
    // New method to check if a branch is selected
    isBranchSelected(branchId) {
      return this.selectedBranches.includes(branchId);
    },

    // Toggle a branch in the multi-tag filter
    toggleBranchFilter(branchId) {
      const index = this.selectedBranches.indexOf(branchId);
      if (index > -1) {
        // Branch is already selected, remove it
        this.selectedBranches.splice(index, 1);
      } else {
        // Branch is not selected, add it
        this.selectedBranches.push(branchId);
      }
      this.applyFilters();
    },

    // Clear all branch filters
    clearBranchFilters() {
      this.selectedBranches = [];
      this.applyFilters();
    },

    // Export filtered episodes to PDF
    async exportToPDF() {
      // Ask user for PDF title
      const title = prompt(
        "Enter a title for the PDF export:",
        `Glory - ${this.filteredEpisodes.length} Episodes`
      );
      if (!title) return; // User cancelled

      this.pdfTitle = title;
      this.isExportingPDF = true;

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
          container.style.lineHeight = "1.5";
          container.style.color = "#000000"; // Explicitly set text color
          container.style.display = "block";
          container.style.visibility = "visible";
          container.style.minHeight = "100px"; // Ensure minimum height
          container.style.wordBreak = "normal"; // Prevent word breaking issues
          container.style.wordWrap = "break-word";
          container.style.overflowWrap = "break-word";
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
              color: "#000000", // Explicitly set text color to black
              visibility: "visible",
              opacity: "1",
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

          // Helper function to add a page break
          const addPageBreak = () => {
            const pageBreak = document.createElement("div");
            pageBreak.style.pageBreakAfter = "always";
            pageBreak.style.breakAfter = "page";
            pageBreak.style.height = "1px";
            container.appendChild(pageBreak);
          };

          // Collect all character data from episodes
          let allCharacters = [];
          let allEpisodeData = [];

          // Process each episode to get data
          const episodesToExport = this.filteredEpisodes;
          for (let i = 0; i < episodesToExport.length; i++) {
            const episode = episodesToExport[i];
            // Update progress indicator
            this.exportProgress = `(${i + 1}/${episodesToExport.length})`;

            const episodeDetails = await viewEpisode(episode.id);
            const episodePosts = await getEpisodePosts(episode.id);

            // Extract characters and add to collection
            const episodeCharacters = [
              ...new UniqueSet(
                episodePosts.map((post) => ({
                  name: post.name,
                  id: post.char_id,
                }))
              ),
            ];

            allCharacters = [...allCharacters, ...episodeCharacters];

            // Store episode data for later processing
            allEpisodeData.push({
              details: episodeDetails[0],
              posts: episodePosts,
              characters: episodeCharacters,
            });
          }

          // Remove duplicate characters using UniqueSet
          const uniqueCharacters = [...new UniqueSet(allCharacters)];

          // Add the PDF title
          addSection([
            createStyledElement("h1", this.pdfTitle, {
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              color: "#000000", // Explicitly set text color to black
            }),
          ]);

          // Add Characters section
          addSection([
            createStyledElement("h2", "Characters", {
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#000000", // Explicitly set text color to black
            }),
          ]);

          // List all unique characters with their ages
          uniqueCharacters.forEach((char) => {
            addSection([
              createStyledElement("p", `${char.name}`, {
                fontSize: "14px",
                marginBottom: "5px",
              }),
            ]);
          });

          // Add page break before episodes
          addPageBreak();

          // Process each episode
          for (let i = 0; i < allEpisodeData.length; i++) {
            const episodeData = allEpisodeData[i];
            const episode = episodeData.details;
            const posts = episodeData.posts;

            // If not the first episode, add a page break
            if (i > 0) {
              addPageBreak();
            }

            // Episode title
            addSection([
              createStyledElement("h2", episode.name, {
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "10px",
                color: "#000000", // Explicitly set text color to black
              }),
            ]);

            // Episode time of action
            addSection([
              createStyledElement("h3", "Time of action:", {
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }),
              createStyledElement(
                "p",
                new Date(episode.timeOfAction).toISOString().split("T")[0],
                {
                  fontSize: "14px",
                }
              ),
            ]);

            // Add each post
            for (let j = 0; j < posts.length; j++) {
              const post = posts[j];

              // Character name
              addSection([
                createStyledElement("h3", `${post.name}:`, {
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }),
                createStyledElement("p", `Age: ${post.age || "Unknown"}`, {
                  fontSize: "12px",
                  marginBottom: "5px",
                  marginLeft: "10px",
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
            }
          }

          // First, make sure the container is visible (but off-screen)
          container.style.visibility = "visible";
          container.style.display = "block";
          container.style.color = "#000000";
          document.body.appendChild(container);

          // Insert a test element to verify rendering
          const testElem = document.createElement("div");
          testElem.textContent = "Test content - should be visible in PDF";
          testElem.style.color = "#000000";
          testElem.style.fontSize = "16px";
          testElem.style.fontWeight = "bold";
          testElem.style.margin = "20px 0";
          container.appendChild(testElem);

          // Longer delay to ensure DOM is fully ready and all styles are applied
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Force a reflow to make sure all styles are applied
          container.getBoundingClientRect();

          // Set specific rendering styles before creating canvas
          container.querySelectorAll("*").forEach((el) => {
            el.style.color = "#000000";
            el.style.fontFamily = "Arial, Helvetica, sans-serif";
            if (
              el.tagName === "DIV" ||
              el.tagName === "P" ||
              el.tagName === "SPAN"
            ) {
              el.style.whiteSpace = "pre-wrap";
            }
          });

          // Fix for canvas security issues
          try {
            document.fonts.ready.then(async () => {
              console.log("Fonts are loaded and ready");
            });
            await document.fonts.ready;
          } catch (e) {
            console.log("Font loading error:", e);
          }

          // Function to split large content into smaller canvases
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
                backgroundColor: "#ffffff",
                width: width,
                height: totalHeight,
                foreignObjectRendering: false, // Try native rendering
                ignoreElements: (element) => {
                  return (
                    element.nodeName === "SCRIPT" ||
                    element.nodeName === "LINK" ||
                    element.classList.contains("hidden")
                  );
                },
                onclone: (clonedDoc) => {
                  // Make sure newlines are preserved in the cloned document
                  const clonedContainer = clonedDoc.body.querySelector(
                    "[style*='position: absolute']"
                  );
                  if (clonedContainer) {
                    // Ensure container is visible in cloned document
                    clonedContainer.style.visibility = "visible";
                    clonedContainer.style.display = "block";
                    clonedContainer.style.color = "#000000";
                    clonedContainer.style.width = width + "px";
                    clonedContainer.style.height = "auto";

                    const allTextElements = clonedContainer.querySelectorAll(
                      "div, p, span, h1, h2, h3"
                    );
                    allTextElements.forEach((el) => {
                      el.style.whiteSpace = "pre-wrap";
                      el.style.lineHeight = "1.5";
                      el.style.pageBreakInside = "avoid";
                      el.style.breakInside = "avoid";
                      el.style.color = "#000000";
                      el.style.opacity = "1";
                      el.style.fontFamily = "Arial, Helvetica, sans-serif";
                    });
                  }
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
                  backgroundColor: "#ffffff",
                  width: width,
                  height: Math.min(maxHeight, totalHeight - yStart),
                  y: yStart,
                  foreignObjectRendering: false,
                  ignoreElements: (element) => {
                    return (
                      element.nodeName === "SCRIPT" ||
                      element.nodeName === "LINK" ||
                      element.classList.contains("hidden")
                    );
                  },
                  onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.body.querySelector(
                      "[style*='position: absolute']"
                    );
                    if (clonedContainer) {
                      const allTextElements = clonedContainer.querySelectorAll(
                        "div, p, span, h1, h2, h3"
                      );
                      allTextElements.forEach((el) => {
                        el.style.whiteSpace = "pre-wrap";
                        el.style.lineHeight = "1.5";
                        el.style.pageBreakInside = "avoid";
                        el.style.breakInside = "avoid";
                        el.style.color = "#000000";
                        el.style.opacity = "1";
                      });
                    }
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

          // Helper function to add canvas to PDF
          const addCanvasToPDF = async (
            canvases,
            doc,
            pageWidth,
            pageHeight,
            margin,
            isNewPage = false
          ) => {
            // Process each canvas and add to PDF
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
                if (i > 0 || canvasIndex > 0 || (i === 0 && isNewPage)) {
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
                    // Fallback: add a text note instead of an image
                    doc.setFontSize(12);
                    doc.setFont(undefined, "normal");
                    doc.setTextColor(0, 0, 0);
                    doc.text(
                      "Content rendering failed for this page",
                      margin,
                      margin + 10
                    );
                  }
                }
              }
            }

            return doc;
          };

          // Generate content canvases
          const contentCanvases = await generateCanvases(container);
          console.log(
            `Generated ${contentCanvases.length} canvases for content`
          );

          // Add content to PDF
          doc = await addCanvasToPDF(
            contentCanvases,
            doc,
            pageWidth,
            pageHeight,
            margin
          );

          // Generate sanitized filename from title
          const sanitizedName = this.pdfTitle
            .replace(/[^a-z0-9а-яА-Я]/gi, "_")
            .replace(/_+/g, "_")
            .toLowerCase();
          const filename = `${sanitizedName}.pdf`;

          // Add page numbers to all pages before saving
          const totalPages = doc.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(
              `Page ${i} of ${totalPages}`,
              pageWidth / 2,
              pageHeight - 10,
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
          this.exportProgress = "";

          // Clean up - remove the temporary container
          if (this.pdfContainer && this.pdfContainer.parentNode) {
            this.pdfContainer.parentNode.removeChild(this.pdfContainer);
            this.pdfContainer = null;
          }
        }
      };

      // Execute the PDF generation
      generatePDF();
    },

    // Apply all current filters
    applyFilters() {
      if (this.filteredByPlayer) {
        this.filterByPlayer();
        return;
      }

      // Get episodes based on status filter
      getEpisodes(this.current_status.id, 0).then((response) => {
        this.allEpisodes = response;

        // Process all episodes to add branches
        this.allEpisodes.forEach((ep, i) => {
          if (ep.branch_ids !== null) {
            const branchIdsArray = ep.branch_ids
              .split(",")
              .map((id) => parseInt(id));
            const branches = this.allBranches.filter((item) =>
              branchIdsArray.includes(item.id)
            );
            this.allEpisodes[i].branches = branches;
            this.allEpisodes[i].branchIds = branchIdsArray;
          } else {
            this.allEpisodes[i].branches = [];
            this.allEpisodes[i].branchIds = [];
          }
        });

        // Filter by selected branches if any
        if (this.selectedBranches.length > 0) {
          this.filteredEpisodes = this.allEpisodes.filter((episode) => {
            if (!episode.branchIds || episode.branchIds.length === 0) {
              return false;
            }
            // Check if episode has ALL of the selected branches
            return this.selectedBranches.every((branchId) =>
              episode.branchIds.includes(branchId)
            );
          });
        } else {
          // No branch filters, show all episodes
          this.filteredEpisodes = [...this.allEpisodes];
        }

        // Reset to first page when filters change
        this.currentPage = 1;
      });
    },
    filterByPlayer() {
      getEpisodesByPlayerId(this.player_id, this.current_status.id).then(
        (response) => {
          this.allEpisodes = response;
          this.filteredByPlayer = true;

          // Process all episodes to add branches
          this.allEpisodes.forEach((ep, i) => {
            if (ep.branch_ids !== null) {
              const branchIdsArray = ep.branch_ids
                .split(",")
                .map((id) => parseInt(id));
              const branches = this.allBranches.filter((item) =>
                branchIdsArray.includes(item.id)
              );
              this.allEpisodes[i].branches = branches;
              this.allEpisodes[i].branchIds = branchIdsArray;
            } else {
              this.allEpisodes[i].branches = [];
              this.allEpisodes[i].branchIds = [];
            }
          });

          // Filter by selected branches if any
          if (this.selectedBranches.length > 0) {
            this.filteredEpisodes = this.allEpisodes.filter((episode) => {
              if (!episode.branchIds || episode.branchIds.length === 0) {
                return false;
              }
              // Check if episode has ALL of the selected branches
              return this.selectedBranches.every((branchId) =>
                episode.branchIds.includes(branchId)
              );
            });
          } else {
            // No branch filters, show all episodes
            this.filteredEpisodes = [...this.allEpisodes];
          }

          // Reset to first page when filters change
          this.currentPage = 1;
        }
      );
    },
    clearPlayerFilter() {
      this.filteredByPlayer = false;
      this.applyFilters();
    },
    // Go to previous page
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        // Scroll to top of list when changing pages
        this.$nextTick(() => {
          const cardElement = document.querySelector(".card");
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    },
    // Go to next page
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // Scroll to top of list when changing pages
        this.$nextTick(() => {
          const cardElement = document.querySelector(".card");
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    },
  },
};
</script>
<style>
/* Tag cloud styling */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

/* Custom tag cloud badge styles that override the default badge styles */
.tag-cloud .badge-primary {
  background-color: #c0d6ff !important;
  color: #000000 !important;
  font-weight: 600;
  margin-right: 6px;
  margin-bottom: 6px;
  border: 1px solid #4c6ef5;
}

.tag-cloud .badge-success {
  background-color: #a0ffca !important;
  color: #000000 !important;
  font-weight: 600;
  margin-right: 6px;
  margin-bottom: 6px;
  border: 1px solid #2dce89;
}

.selected-branch {
  font-weight: bold;
  border: 2px solid #fff !important;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

.badge-counter {
  margin-left: 5px;
}

/* Small animation for tag selection */
.tag-cloud .badge {
  transition: all 0.2s ease;
  opacity: 0.95;
  padding: 6px 10px;
}

.tag-cloud .badge:hover {
  transform: scale(1.05);
  cursor: pointer;
  opacity: 1;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
}

/* Pagination styling */
.pagination-container {
  padding: 0.5rem 0;
}

.pagination-controls .btn {
  min-width: 2.5rem;
}

.pagination-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #8898aa;
  font-size: 0.875rem;
}
</style>
