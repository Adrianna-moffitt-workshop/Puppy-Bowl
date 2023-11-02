const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-FTB-ET-WEB-PT";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const players = await response.json();
    return players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

// Return Team Name
const teamName = (player) => {
  let teamName = "";
  if (player.teamId === 45) {
    teamName = "Team Ruff";
  } else if (player.teamId === 46) {
    teamName = "Team Fluff";
  } else {
    teamName = "Free Agent";
  }
  return teamName;
};

// Return Team ID value based on user selection of the drop-down list
const teamId = (team) => {
  let teamId = undefined;
  if (team === "fluff") {
    teamId = 46;
  } else if (team === "ruff") {
    teamId = 45;
  }
  return teamId;
};

const fetchSinglePlayer = async (player) => {
  try {
    playerContainer.innerHTML = "";
    const singlePlayerElement = document.createElement("div");
    singlePlayerElement.classList.add("player-card");
    singlePlayerElement.innerHTML = `
      <h2>${player.name}</h2>
      <img src="${player.imageUrl}" alt="Player Name">
      <div class="details">
        <div>
          <p>Breed: ${player.breed} </p>
          <p>${teamName(player)}</p>
        </div>
        <div id="buttons">
          <button class="return-button">Return</button>
        </div>
      </div>
    `;
    playerContainer.appendChild(singlePlayerElement);

    // Return button
    const returnButton = playerContainer.querySelector(".return-button");
    returnButton.addEventListener("click", async (event) => {
      init();
    });
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${player}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

const renderAllPlayers = (playerList) => {
  try {
    playerContainer.innerHTML = "";
    playerList.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player-card");
      playerElement.classList.add("detail-card");
      playerElement.innerHTML = `
        <h2>${player.name}</h2>
        <img src="${player.imageUrl}" alt="Player Name">
        <div id="buttons">
          <button class="detail-button">Details</button>
          <button class="delete-button">Delete</button>
        </div>
      `;
      playerContainer.appendChild(playerElement);

      // See Details
      const detailsButton = playerElement.querySelector(".detail-button");
      detailsButton.addEventListener("click", async (event) => {
        await fetchSinglePlayer(player);
      });

      const deleteButton = playerElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        await removePlayer(player.id);
        init();
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const renderNewPlayerForm = () => {
  try {
    const newPlayerFormElement = document.createElement("form");

    newPlayerFormContainer.innerHTML = "";
    newPlayerFormElement.setAttribute("id", "player_form");
    newPlayerFormElement.innerHTML = `
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="player_name" />
      </div>
      <div>
        <label for="breed">Breed:</label>
        <input type="text" id="breed" name="player_breed" />
      </div>
      <div>
        <label for="imageUrl">Image URL:</label>
        <input type="url" id="imageUrl" name="player_image" />
      </div>
      <label for="team">Team:</label>
      <select name="team" id="team">
        <option value="freeAgent">Free Agent</option>
        <option value="fluff">Team Fluff</option>
        <option value="ruff">Team Ruff</option>
      </select>
      <div>
        <button class="add-player-button">Add Player</button>
      </div>
    `;
    newPlayerFormContainer.append(newPlayerFormElement);

    // Add Player Button
    const playerButton = document.querySelector(".add-player-button");
    const newNameText = document.querySelector("#name");
    const newBreedText = document.querySelector("#breed");
    const newUrlText = document.querySelector("#imageUrl");
    const newTeam = document.querySelector("#team");

    playerButton.addEventListener("click", async (event) => {
      let playerInfo = {
        name: newNameText.value,
        breed: newBreedText.value,
        imageUrl: newUrlText.value,
        teamId: teamId(newTeam.value),
      };
      await addNewPlayer(playerInfo);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};

init();