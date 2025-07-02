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
            v-if="authState && authState.isAuthenticated"
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
    });
    // For authenticated user, load that user's episodes
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
              this.allEpisodes = response;
              this.filteredEpisodes = this.allEpisodes;
              getAllBranches().then((allBranches) => {
                this.allBranches = allBranches;
                this.filteredByPlayer = true;
                this.allEpisodes.forEach((ep, i) => {
                  if (ep.branch_ids !== null) {
                    const branchIdsArray = ep.branch_ids
                      .split(",")
                      .map((id) => parseInt(id));
                    const branches = this.allBranches.filter((item) =>
                      branchIdsArray.includes(item.id)
                    );
                    this.allEpisodes[i].branches = branches;
                  }
                });
              });
            }
          );
        });
      }
    }
    // For unauthenticated user, load all episodes
    if (!(this.authState && this.authState.isAuthenticated)) {
      getEpisodes(this.current_status.id, this.branch_id).then((response) => {
        this.allEpisodes = response;
        this.filteredEpisodes = response;
        getAllBranches().then((allBranches) => {
          this.allBranches = allBranches;
          this.allEpisodes.forEach((ep, i) => {
            if (ep.branch_ids !== null) {
              const branchIdsArray = ep.branch_ids
                .split(",")
                .map((id) => parseInt(id));
              const branches = this.allBranches.filter((item) =>
                branchIdsArray.includes(item.id)
              );
              this.allEpisodes[i].branches = branches;
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
      if (this.filteredByPlayer) {
        this.filterByPlayer();
      } else {
        this.applyFilters();
      }
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

          // Helper function to clean HTML text while preserving newlines
          const cleanHtmlText = (htmlText) => {
            if (!htmlText || typeof htmlText !== "string") return "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlText
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/<p>/gi, "")
              .replace(/<\/p>/gi, "\n\n")
              .replace(/<(?!\/?br|\/?p)[^>]+>/gi, ""); // Remove all other HTML tags

            const cleanText = (
              tempDiv.textContent ||
              tempDiv.innerText ||
              htmlText
            ).replace(/\r\n/g, "\n"); // Normalize all newlines

            return cleanText;
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
                  status: post.status,
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

          // Direct PDF text rendering - start Y position
          let y = margin;

          // Title
          doc.setFontSize(14);
          doc.setFont("DejaVuSans", "bold");
          doc.text(this.pdfTitle, pageWidth / 2, (y += 10), {
            align: "center",
            maxWidth: pageWidth - 2 * margin,
          });
          y += 8;

          // Characters section
          doc.setFontSize(10);
          doc.setFont("DejaVuSans", "bold");
          doc.text("Characters", margin, y);
          y += 5;

          // List all unique characters
          doc.setFontSize(9);
          doc.setFont("DejaVuSans", "normal");

          uniqueCharacters.forEach((char) => {
            doc.text(`${char.name}`, margin, y);
            y += 4;

            // Check for page overflow and create new page if needed
            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin + 10;
            }
          });

          // Episodes list section
          doc.setFontSize(10);
          doc.setFont("DejaVuSans", "bold");
          doc.text("Chapters/Episodes:", margin, y);
          y += 5;

          // List all the episode titles
          doc.setFontSize(9);
          doc.setFont("DejaVuSans", "normal");

          allEpisodeData.forEach((episode) => {
            doc.text(`${episode.details.name}`, margin, y);
            y += 4;

            // Check for page overflow and create new page if needed
            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin + 10;
            }
          });

          // Process each episode
          for (let i = 0; i < allEpisodeData.length; i++) {
            const episodeData = allEpisodeData[i];
            const episode = episodeData.details;
            const posts = episodeData.posts;

            // Always start a new page for each episode
            doc.addPage();
            y = margin + 10;

            // Episode title
            doc.setFontSize(12);
            doc.setFont("DejaVuSans", "bold");
            doc.text(episode.name, pageWidth / 2, y, {
              align: "center",
              maxWidth: pageWidth - 2 * margin,
            });
            y += 8;

            // Episode time of action
            doc.setFontSize(10);
            doc.setFont("DejaVuSans", "bold");
            doc.text("Time of action:", margin, y);
            y += 5;

            try {
              doc.setFontSize(9);
              doc.setFont("DejaVuSans", "normal");
              doc.text(
                new Date(episode.timeOfAction).toISOString().split("T")[0],
                margin,
                y
              );
              y += 8;
            } catch (error) {
              console.error(error);
            }

            // Episode description
            doc.setFontSize(10);
            doc.setFont("DejaVuSans", "bold");
            doc.text("Description:", margin, y);
            y += 5;

            const cleanDescription = cleanHtmlText(episode.description);
            doc.setFontSize(9);
            doc.setFont("DejaVuSans", "normal");

            // Split description text to fit page width
            const descLines = doc.splitTextToSize(
              cleanDescription,
              pageWidth - 2 * margin - 10
            );
            doc.text(descLines, margin + 5, y);
            y += descLines.length * 4.5 + 3;

            // Process each post for this episode
            for (let j = 0; j < posts.length; j++) {
              const post = posts[j];

              // Add page break before the first post in the episode
              if (j === 0) {
                doc.addPage();
                y = margin + 10;
              }

              // Character name
              doc.setFontSize(10);
              doc.setFont("DejaVuSans", "bold");
              doc.text(`${post.name} (${post.status}):`, margin, y);
              y += 5;

              // Character age
              doc.setFontSize(9);
              doc.setFont("DejaVuSans", "normal");
              doc.text(`Age: ${post.age || "Unknown"}`, margin + 5, y);
              y += 5;

              // Post body - clean up HTML and preserve newlines
              const cleanText = cleanHtmlText(post.body);

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

              // Add separator between posts
              if (j < posts.length - 1) {
                doc.setFontSize(9);
                doc.text("***", pageWidth / 2, y, { align: "center" });
                y += 8;

                // Check for page overflow and create new page if needed
                if (y > pageHeight - margin) {
                  doc.addPage();
                  y = margin + 10;
                }
              }
            }
          }

          // Add page numbers to all pages
          const totalPages = doc.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont("DejaVuSans", "normal");
            doc.text(
              `Page ${i} of ${totalPages}`,
              pageWidth / 2,
              pageHeight - 5,
              { align: "center" }
            );
          }

          // Generate sanitized filename
          const sanitizedName = this.pdfTitle
            .replace(/[^a-z0-9а-яА-Я]/gi, "_")
            .replace(/_+/g, "_")
            .toLowerCase();

          // Save the PDF
          doc.save(`${sanitizedName}.pdf`);
        } catch (error) {
          console.error("Error generating PDF:", error);
          alert("There was an error generating the PDF. Please try again.");
        } finally {
          // Reset loading state
          this.isExportingPDF = false;
          this.exportProgress = "";
        }
      };

      // Execute the PDF generation
      generatePDF();
    },

    // Apply all current filters
    applyFilters() {
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
          console.log("filterByPlayer");
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
