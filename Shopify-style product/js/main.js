document.addEventListener("DOMContentLoaded", () => {
  // Product Gallery
  initProductGallery()

  // Color Selection
  initColorSelection()

  // Size Selection
  initSizeSelection()

  // Product Tabs
  initProductTabs()

  // Modals
  initModals()

  // Color Comparison
  initColorComparison()

  // Carousels
  initCarousels()

  // Add to Cart
  initAddToCart()

  // Load saved preferences
  loadSavedPreferences()
})

// Product Gallery
function initProductGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImage = document.getElementById("main-image")
  const mainImageContainer = document.getElementById("main-product-image")
  const zoomButton = document.querySelector(".zoom-button")
  const thumbnailPrev = document.querySelector(".thumbnail-prev")
  const thumbnailNext = document.querySelector(".thumbnail-next")
  const thumbnailsContainer = document.querySelector(".thumbnails-container")

  // Thumbnail click
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Update active thumbnail
      thumbnails.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Update main image
      const imageUrl = this.getAttribute("data-image")
      mainImage.src = imageUrl

      // Reset zoom
      mainImageContainer.classList.remove("zoomed")
    })
  })

  // Zoom functionality
  zoomButton.addEventListener("click", toggleZoom)
  mainImageContainer.addEventListener("click", toggleZoom)

  function toggleZoom() {
    mainImageContainer.classList.toggle("zoomed")
  }

  // Image zoom with mouse position
  const isZoomed = false

  mainImageContainer.addEventListener("mousemove", (e) => {
    if (!mainImageContainer.classList.contains("zoomed")) return

    const rect = mainImageContainer.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    mainImageContainer.style.transformOrigin = `${x}% ${y}%`
  })

  mainImageContainer.addEventListener("mouseleave", () => {
    if (mainImageContainer.classList.contains("zoomed")) {
      mainImageContainer.classList.remove("zoomed")
    }
  })

  // Thumbnail navigation
  thumbnailPrev.addEventListener("click", () => {
    thumbnailsContainer.scrollBy({
      top: -100,
      left: -100,
      behavior: "smooth",
    })
  })

  thumbnailNext.addEventListener("click", () => {
    thumbnailsContainer.scrollBy({
      top: 100,
      left: 100,
      behavior: "smooth",
    })
  })
}

// Color Selection
function initColorSelection() {
  const colorSwatches = document.querySelectorAll(".color-swatch")
  const selectedColorName = document.getElementById("selected-color-name")
  const mainImage = document.getElementById("main-image")

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      // Update active swatch
      colorSwatches.forEach((s) => s.classList.remove("active"))
      this.classList.add("active")

      // Update selected color name
      const colorName = this.getAttribute("data-color-name")
      selectedColorName.textContent = colorName

      // Update main image if color has an image
      const colorImage = this.getAttribute("data-color-image")
      if (colorImage) {
        mainImage.src = colorImage

        // Update active thumbnail
        const thumbnails = document.querySelectorAll(".thumbnail")
        thumbnails.forEach((t) => t.classList.remove("active"))
        thumbnails[0].classList.add("active")
      }

      // Save preference to localStorage
      saveColorPreference(this.getAttribute("data-color-id"))
    })
  })
}

// Size Selection
function initSizeSelection() {
  const sizeButtons = document.querySelectorAll(".size-button")

  sizeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active button
      sizeButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Save preference to localStorage
      saveSizePreference(this.getAttribute("data-size-id"))
    })
  })
}

// Product Tabs
function initProductTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabPanels = document.querySelectorAll(".tab-panel")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Update active tab panel
      tabPanels.forEach((panel) => {
        panel.classList.remove("active")
        if (panel.id === tabId) {
          panel.classList.add("active")
        }
      })
    })
  })
}

// Modals
function initModals() {
  const sizeChartBtn = document.getElementById("size-chart-btn")
  const compareColorsBtn = document.getElementById("compare-colors-btn")
  const sizeChartModal = document.getElementById("size-chart-modal")
  const compareColorsModal = document.getElementById("compare-colors-modal")
  const closeModalButtons = document.querySelectorAll(".close-modal")

  // Size Chart Modal
  sizeChartBtn.addEventListener("click", () => {
    sizeChartModal.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  // Compare Colors Modal
  compareColorsBtn.addEventListener("click", () => {
    compareColorsModal.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  // Close Modals
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Close modal with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active")
      if (activeModal) {
        activeModal.classList.remove("active")
        document.body.style.overflow = ""
      }
    }
  })
}

// Color Comparison
function initColorComparison() {
  const compareColorSwatches = document.querySelectorAll(".compare-color-swatch")
  const selectedColorsComparison = document.getElementById("selected-colors-comparison")
  const clearComparisonBtn = document.getElementById("clear-comparison")
  let selectedColors = []

  compareColorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const colorId = this.getAttribute("data-color-id")
      const colorName = this.getAttribute("data-color-name")
      const colorHex = this.getAttribute("data-color-hex")

      // Check if color is already selected
      const colorIndex = selectedColors.findIndex((color) => color.id === colorId)

      if (colorIndex === -1) {
        // Add color to selection
        selectedColors.push({
          id: colorId,
          name: colorName,
          hex: colorHex,
        })
        this.classList.add("selected")
      } else {
        // Remove color from selection
        selectedColors.splice(colorIndex, 1)
        this.classList.remove("selected")
      }

      updateColorComparison()
    })
  })

  clearComparisonBtn.addEventListener("click", () => {
    selectedColors = []
    compareColorSwatches.forEach((swatch) => swatch.classList.remove("selected"))
    updateColorComparison()
  })

  function updateColorComparison() {
    if (selectedColors.length === 0) {
      selectedColorsComparison.innerHTML = '<p class="empty-comparison-message">Select colors above to compare</p>'
      clearComparisonBtn.disabled = true
    } else {
      let html = ""
      selectedColors.forEach((color) => {
        html += `
          <div class="comparison-color">
            <div class="comparison-color-swatch" style="background-color: ${color.hex}"></div>
            <p class="comparison-color-name">${color.name}</p>
          </div>
        `
      })
      selectedColorsComparison.innerHTML = html
      clearComparisonBtn.disabled = false
    }
  }
}

// Carousels
function initCarousels() {
  const productsCarousel = document.querySelector(".products-carousel")
  const carouselPrev = document.querySelector(".carousel-prev")
  const carouselNext = document.querySelector(".carousel-next")

  carouselPrev.addEventListener("click", () => {
    productsCarousel.scrollBy({
      left: -300,
      behavior: "smooth",
    })
  })

  carouselNext.addEventListener("click", () => {
    productsCarousel.scrollBy({
      left: 300,
      behavior: "smooth",
    })
  })
}

// Add to Cart
function initAddToCart() {
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  const secondaryButtons = document.querySelectorAll(".secondary-button")
  const bundleButton = document.querySelector(".product-bundle .primary-button")

  addToCartBtn.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-button.active")

    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    const colorName = document.getElementById("selected-color-name").textContent
    const sizeName = selectedSize.getAttribute("data-size-name")

    alert(`Added to cart: Premium Cotton Crewneck Sweater in ${colorName}, size ${sizeName}`)
    updateCartCount(1)
  })

  secondaryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productName = this.closest(".product-card").querySelector("h3").textContent
      alert(`Added to cart: ${productName}`)
      updateCartCount(1)
    })
  })

  bundleButton.addEventListener("click", () => {
    alert("Added complete bundle to cart!")
    updateCartCount(3) // Bundle has 3 items
  })

  function updateCartCount(increment) {
    const cartCount = document.querySelector(".cart-count")
    let count = Number.parseInt(cartCount.textContent)
    count += increment
    cartCount.textContent = count
  }
}

// Save and Load Preferences
function saveColorPreference(colorId) {
  localStorage.setItem("selectedColorId", colorId)
}

function saveSizePreference(sizeId) {
  localStorage.setItem("selectedSizeId", sizeId)
}

function loadSavedPreferences() {
  const savedColorId = localStorage.getItem("selectedColorId")
  const savedSizeId = localStorage.getItem("selectedSizeId")

  if (savedColorId) {
    const colorSwatch = document.querySelector(`.color-swatch[data-color-id="${savedColorId}"]`)
    if (colorSwatch) {
      colorSwatch.click()
    }
  }

  if (savedSizeId) {
    const sizeButton = document.querySelector(`.size-button[data-size-id="${savedSizeId}"]`)
    if (sizeButton) {
      sizeButton.click()
    }
  }
}
