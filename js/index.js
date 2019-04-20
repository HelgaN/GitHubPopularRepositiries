import GitHubService from "./service/service";
import itemTemplate from "./templates/item-template";
import itemFilterTemplate from "./templates/item-filter-template";
import {
  createUniqueList,
  sortByNewest,
  sortByOldest,
  searchActiveEl,
  removePreloader
} from "./tools/tools";

class App {
  constructor() {
    this.repsList = document.getElementById("reps-list");
    this.langList = document.getElementById("lang");
    this.updateList = document.getElementById("update");
    this.reset = document.querySelector(".btn-reset");
  }

  createRepList(data) {
    let list = data.items.map((item) => itemTemplate(item));
    this.repsList.innerHTML = list.join("");
  }

  createLangList(data) {
    let langArray = [];
    data.forEach((item) => langArray.push(item.language !== null ? item.language : "content"));
    const uniqueLangList = createUniqueList(langArray);

    let list = uniqueLangList.map((item) => itemFilterTemplate(item));
    list.push(itemFilterTemplate("all"));
    this.langList.innerHTML += list.join("");
  }

  creatUpdateList(data) {
    const list = data.map((item) => itemFilterTemplate(item));;
    this.updateList.innerHTML += list.join("");
  }

  initializeEvents(data) {
    this.langList.addEventListener("click", (evt) => {
      evt.preventDefault();
      const langLinks = lang.querySelectorAll(".dropdown-item");
      langLinks.forEach((link) => link.classList.remove("active"));
      evt.target.classList.add("active");
      let filterName = evt.target.innerText;
      if(evt.target.innerText === "content") {
        filterName = null;
      }

      let dataFilter;

      filterName !== "all"
      ? dataFilter = {
        items: data.filter(item => item.language == filterName)
      } : dataFilter = {
        items: data
      }

      const activeUpdate = searchActiveEl(this.updateList) || undefined;

      if(activeUpdate) {
        activeUpdate.innerText === "newest" ? dataFilter.items = sortByNewest(dataFilter.items) : null;
        activeUpdate.innerText === "oldest" ? dataFilter.items = sortByOldest(dataFilter.items) : null;
      }
      this.createRepList(dataFilter);
    });

    this.updateList.addEventListener("click", (evt) => {
      evt.preventDefault();
      const updateLinks = update.querySelectorAll(".dropdown-item");
      updateLinks.forEach((link) => link.classList.remove("active"));
      evt.target.classList.add("active");
      let filterName = evt.target.innerText;

      let sortData = {};
      filterName === "newest" ? sortData.items = sortByNewest([...data]) : sortData.items = sortByOldest([...data]);
      const activeLang = searchActiveEl(this.langList) || "all";

      if(activeLang.innerHTML !== "all" && activeLang.innerHTML !== undefined) {
        let sortDataByLang = [];
        sortData.items.forEach((item) => {
          if(item.language === activeLang.innerText || item.language === null && activeLang.innerHTML === "content") {
            sortDataByLang.push(item);
          }
        });
        sortData.items = sortDataByLang;
      }

      this.createRepList(sortData);
    });

    this.reset.addEventListener("click", () => {
      const allItems = {
        items: data
      }
      this.createRepList(allItems);
    })
  };

  init(data) {
    this.createRepList(data);
    this.createLangList(data.items);
    this.creatUpdateList(["newest", "oldest"]);
    this.initializeEvents(data.items);
    removePreloader("jumbotron");
  }
}


const runApp = async () => {
  try {
    const Service = new GitHubService();
    const app = new App();
    const data = await Service.getPopularRepositories();
    app.init(data);
  } catch(error) {
    console.error(`APPLICATION ERROR! ${error}`);
  }
}

runApp();
