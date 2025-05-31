function toggleMenu() {
  document.querySelector('.filter-container').classList.toggle('show');
  document.querySelector('.hamburger-menu').classList.toggle('active');
}

const fetchData = async () => {
  try {
    const baseUrl = "https://cdn.contentful.com/spaces/";
    const SPACE_ID = localStorage.getItem("space_id");
    const ACCESS_TOKEN = localStorage.getItem("access_token");

    if (!SPACE_ID || !ACCESS_TOKEN) {
      throw new Error("API keys are missing in localStorage.");
    }

    const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist`;
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("HTTP error! Something went wrong with the request.");
    }

    const data = await response.json();

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    const getReferencedData = (id, field) => {
      const reference = data.includes?.Entry?.find((entry) => entry.sys.id === id);
      return reference ? reference.fields[field] : "Unknown";
    };

    const renderArtists = (artists) => {
      contentDiv.innerHTML = "";

      artists.forEach((artist) => {
        const artistCard = document.createElement("div");
        artistCard.classList.add("artist-card");

        const artistName = document.createElement("h3");
        artistName.textContent = artist.fields.name || "Unknown artist";

        const genre = document.createElement("p");
        const genreValue = artist.fields.genre
          ? getReferencedData(artist.fields.genre.sys.id, "name")
          : "Unknown genre";
        genre.innerHTML = `<span class="bold">Genre:</span> ${genreValue}`;

        const stage = document.createElement("p");
        const stageValue = artist.fields.stage
          ? getReferencedData(artist.fields.stage.sys.id, "name")
          : "Unknown stage";
        stage.innerHTML = `<span class="bold">Stage:</span> ${stageValue}`;

        const day = document.createElement("p");
        const dayData = artist.fields.day
          ? `${getReferencedData(artist.fields.day.sys.id, "description")} (${getReferencedData(
              artist.fields.day.sys.id,
              "date"
            )})`
          : "Unknown day";
        day.innerHTML = `<span class="bold">Day:</span> ${dayData}`;

        const description = document.createElement("p");
        const descriptionValue = artist.fields.description || "No description available.";
        description.innerHTML = `<span class="bold">Description:</span> ${descriptionValue}`;

        artistCard.appendChild(artistName);
        artistCard.appendChild(genre);
        artistCard.appendChild(stage);
        artistCard.appendChild(day);
        artistCard.appendChild(description);

        contentDiv.appendChild(artistCard);
      });
    };

    renderArtists(data.items);

    window.filterArtists = (field, value) => {
      const filteredArtists = data.items.filter((artist) => {
        const refId = artist.fields[field]?.sys.id;
        const refValue = refId ? getReferencedData(refId, "name") : null;
        return refValue === value || artist.fields[field] === value;
      });

      renderArtists(filteredArtists);
    };

    window.resetFilters = () => {
      renderArtists(data.items);
    };

  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    document.getElementById("content").textContent =
      "An error occurred while fetching data. Please try again later.";
  }
};

fetchData();
