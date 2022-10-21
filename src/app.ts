import * as m from 'mithril';
import SearchComponent from './components/SearchComponent';

class AppState {
    public term:string|null;
    public results:string[]|null;

    constructor() {
        this.term = null;
        this.results = null;
    }

    performSearch(term) {
        this.term = term;
        m.route.set("/search", {term:term}, {replace:true});

        m.request({
            method: "GET",
            url: "/api/v1/authors",
            params: {term: term}
        })
        .then(res => {
            console.log("Api response", res);
            appState.results = res as string[];
        });
    }

    openExternalLink(authorName:string) {        
        console.log("openExternalLink: m.route.get:", m.route.get());
        // save the state for this route
        // this is equivalent to `history.replaceState({term: state.term}, null, location.href)`
        m.route.set(m.route.get(), null, {
            replace: true, 
            state: {
                appState: appState,
                term: this.term, 
                results: this.results 
            }
        })

        console.log("navigate away...");
        location.href = "https://google.com/?q=" + authorName;
    }

    syncWithHistory() {        
        console.log("syncWithHistory history.state:", history.state);
        if(history.state != null) {            
            appState.term = history.state.term;
            appState.results = history.state.results;            
            console.log("syncWithHistory DONE! appState:", appState);
        }
    }

    syncWithSearchRoute(givenTerm: string|null) {
        console.log("syncWithSearchRoute: appState.term=", this.term, " givenTerm:", givenTerm)
        
        if(givenTerm != this.term) {
            this.term = givenTerm;
            this.performSearch(givenTerm);
        }
         
        /*return new Promise((resolve, reject) => {
            if(this.term == null && givenTerm) {
                this.term = m.route.param("term");
            } 
        });*/
    }
}

let appState = new AppState();
console.log("Initial appState:", appState);
appState.syncWithHistory();

window.addEventListener('popstate', (event) => {
    //TODO bug: forward need to be only applied to rooms route and guest info route
    console.log("popstate: event: ", event);
    console.log("popstate: location.href: ", location.href);
    console.log("popstate: history.state: ", history.state);
});

var Menu = {
    view: function() {
        return m("nav", [
            m(m.route.Link, {href: "/"}, "Home"),
            m("span", " | "),
            m(m.route.Link, {href: "/search"}, "Search"),
            m("span", " | "),
            m(m.route.Link, {href: "/about"}, "About Us")
        ])
    }
}

var HomePage = {
    view: function() {
        return [
            m(Menu),
            m("h1", "Home")
        ]
    }
}

m.route(document.body, "/", {
    "/": HomePage,
    "/search": {
        onmatch: (args, requestedPath) => {
            console.log("search::onmatch args:", args);
            console.log("search::onmatch requestedPath:", requestedPath);
            /*if (appState.term == "") {
                m.route.set("/home")
                return undefined;
            }*/
            //appState.syncSearchRouteState(args.term);
            //return SearchPage
            appState.syncWithSearchRoute(args.term);            
        },
        
        render : function(vnode){
            console.log("search::oninit vnode.attrs:", vnode.attrs);
            return [
                m(Menu),
                m("h1", "Search"),
                m(SearchComponent, {
                    term: appState.term,
                    results: appState.results,
                    onSearchRequested: (term:string) => {
                        appState.performSearch(term);
                    },                    
                    onGoogleSearchRequested: (authorName:string) => {
                        appState.openExternalLink(authorName);
                    }
                })
            ]
        }
    },
    "/about": {
        render : function(){
            return [
                m(Menu),
                m("h1", "About Us")
            ]
        }
    }, 
    "/sessions/:id": {
        render : function(){
            return [
                m(Menu),
                m("h1", "Session " + m.route.param("id"))
            ]
        }
    } 
});

//m.route.set("/home");
