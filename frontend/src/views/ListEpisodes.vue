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
import "../assets/fonts/DejaVuSans-ExtraLight-normal.js";
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
          doc.setFont("DejaVuSans-ExtraLight", "normal");

          // Get page dimensions
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 10; // 10mm margins
          const contentWidth = pageWidth - 2 * margin;

          // Create the main container for the entire PDF
          const mainContainer = document.createElement("div");
          mainContainer.style.fontFamily =
            "DejaVuSans-ExtraLight, Arial, sans-serif";
          mainContainer.style.width = contentWidth * 3.5 + "px"; // Convert to pixels for better rendering
          mainContainer.style.maxWidth = "100%";
          mainContainer.style.margin = "0";
          mainContainer.style.padding = "0";
          mainContainer.style.color = "#000000";
          mainContainer.style.backgroundColor = "#ffffff";
          mainContainer.style.lineHeight = "1.2";
          document.body.appendChild(mainContainer);
          this.pdfContainer = mainContainer;

          // Helper function to clean HTML text
          const cleanHtmlText = (htmlText) => {
            if (!htmlText || typeof htmlText !== "string") return "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlText
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/<p>/gi, "")
              .replace(/<\/p>/gi, "\n\n");
            return tempDiv.textContent || tempDiv.innerText || htmlText;
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

          // Create title section
          const titleHeading = document.createElement("h1");
          titleHeading.textContent = this.pdfTitle;
          titleHeading.style.fontSize = "10px";
          titleHeading.style.fontWeight = "bold";
          titleHeading.style.textAlign = "center";
          titleHeading.style.marginBottom = "10px";
          titleHeading.style.color = "#000000";
          mainContainer.appendChild(titleHeading);

          // Create characters section
          const charsHeading = document.createElement("h2");
          charsHeading.textContent = "Characters";
          charsHeading.style.fontSize = "9px";
          charsHeading.style.fontWeight = "bold";
          charsHeading.style.marginBottom = "5px";
          charsHeading.style.color = "#000000";
          mainContainer.appendChild(charsHeading);

          // List all unique characters
          uniqueCharacters.forEach((char) => {
            const charName = document.createElement("p");
            charName.textContent = `${char.name}`;
            charName.style.fontSize = "7px";
            charName.style.marginBottom = "3px";
            mainContainer.appendChild(charName);
          });

          // Add page break before episodes
          const pageBreak = document.createElement("div");
          pageBreak.style.pageBreakAfter = "always";
          pageBreak.style.breakAfter = "page";
          pageBreak.style.height = "1px";
          mainContainer.appendChild(pageBreak);

          // Process each episode
          for (let i = 0; i < allEpisodeData.length; i++) {
            const episodeData = allEpisodeData[i];
            const episode = episodeData.details;
            const posts = episodeData.posts;

            // If not the first episode, add a page break
            if (i > 0) {
              const episodePageBreak = document.createElement("div");
              episodePageBreak.style.pageBreakBefore = "always";
              episodePageBreak.style.breakBefore = "page";
              mainContainer.appendChild(episodePageBreak);
            }

            // Episode title
            const episodeTitle = document.createElement("h2");
            episodeTitle.textContent = episode.name;
            episodeTitle.style.fontSize = "9px";
            episodeTitle.style.fontWeight = "bold";
            episodeTitle.style.textAlign = "center";
            episodeTitle.style.marginBottom = "5px";
            episodeTitle.style.color = "#000000";
            mainContainer.appendChild(episodeTitle);

            // Episode time of action
            const dateTitle = document.createElement("h3");
            dateTitle.textContent = "Time of action:";
            dateTitle.style.fontSize = "8px";
            dateTitle.style.fontWeight = "bold";
            dateTitle.style.marginBottom = "3px";
            mainContainer.appendChild(dateTitle);

            const dateText = document.createElement("p");
            dateText.textContent = new Date(episode.timeOfAction)
              .toISOString()
              .split("T")[0];
            dateText.style.fontSize = "7px";
            dateText.style.marginBottom = "8px";
            mainContainer.appendChild(dateText);

            // Process each post for this episode
            for (let j = 0; j < posts.length; j++) {
              const post = posts[j];

              // Character name
              const charName = document.createElement("h3");
              charName.textContent = `${post.name}:`;
              charName.style.fontSize = "8px";
              charName.style.fontWeight = "bold";
              charName.style.marginBottom = "3px";
              mainContainer.appendChild(charName);

              // Character age
              const charAge = document.createElement("p");
              charAge.textContent = `Age: ${post.age || "Unknown"}`;
              charAge.style.fontSize = "6px";
              charAge.style.marginBottom = "3px";
              charAge.style.marginLeft = "5px";
              mainContainer.appendChild(charAge);

              // Post body
              const postBody = document.createElement("div");
              postBody.textContent = cleanHtmlText(post.body);
              postBody.style.fontSize = "7px";
              postBody.style.lineHeight = "1.2";
              postBody.style.whiteSpace = "pre-wrap";
              postBody.style.maxWidth = "100%";
              postBody.style.wordBreak = "break-word";
              postBody.style.textAlign = "left";
              postBody.style.padding = "0";
              postBody.style.marginBottom = "8px";
              mainContainer.appendChild(postBody);

              // Add separator between posts (except for the last one)
              if (j < posts.length - 1) {
                const separator = document.createElement("div");
                separator.textContent = "***";
                separator.style.textAlign = "center";
                separator.style.margin = "6px 0";
                separator.style.fontSize = "7px";
                separator.style.borderBottom = "1px solid #ddd";
                separator.style.paddingBottom = "5px";
                mainContainer.appendChild(separator);
              }
            }
          }

          // Make sure fonts are loaded before rendering
          try {
            await document.fonts.ready;
            console.log("Fonts are loaded and ready");
          } catch (e) {
            console.log("Font loading error:", e);
          }

          // Use jsPDF's html method to render HTML content directly
          await doc.html(mainContainer, {
            callback: function (doc) {
              // Add page numbers
              const totalPages = doc.internal.getNumberOfPages();
              for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(6);
                doc.setTextColor(100, 100, 100);
                doc.text(
                  `Page ${i} of ${totalPages}`,
                  pageWidth / 2,
                  pageHeight - 5,
                  { align: "center" }
                );
              }

              // Generate sanitized filename and save the PDF
              const sanitizedName = this.pdfTitle
                .replace(/[^a-z0-9а-яА-Я]/gi, "_")
                .replace(/_+/g, "_")
                .toLowerCase();
              doc.save(`${sanitizedName}.pdf`);
            }.bind(this),
            x: margin,
            y: margin,
            width: contentWidth - 5, // Reduce width for better margins
            windowWidth: 350, // Fixed pixel width for rendering
            autoPaging: true,
            margin: [margin, margin, margin, margin],
            html2canvas: {
              scale: 0.5, // Lower scale for better fit
              useCORS: true,
              logging: false,
            },
          });

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
