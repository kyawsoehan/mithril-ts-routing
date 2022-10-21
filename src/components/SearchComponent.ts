import * as m from 'mithril';

interface Attrs {
    term: string|null;
    results: string[]|null;
    onSearchRequested: (term:string) => void;
    onGoogleSearchRequested: (authorName:string) => void;
}

export default function SearchComponent(): m.Component<Attrs> {
    return {
        oninit: function(vnode) {
            console.log("SearchComponent::oninit vnode.attrs:", vnode.attrs);
        },
        onupdate: function(vnode) {
            console.log("SearchComponent::onupdate vnode.attrs:", vnode.attrs);
        },
        view: function(vnode) {
            return [
                m(SearchForm, {
                    term: vnode.attrs.term,
                    onSearchRequested: (term) => {
                        vnode.attrs.onSearchRequested(term);
                    }
                }),
                (vnode.attrs.results != null)? 
                m("div", [
                    m("p", vnode.attrs.results.length + " result(s) for : " + vnode.attrs.term),
    
                    m("table", {border:0}, 
                        vnode.attrs.results.map(authorName => {
                            return m("tr", [
                                m("td", {width:"240px"}, authorName),
                                m("td", 
                                    m("a", {
                                        href:"#",
                                        onclick:(event) => {
                                            event.preventDefault();
                                            vnode.attrs.onGoogleSearchRequested(authorName);
                                        }
                                    }, "Search On Google")
                                )
                            ])
                        })
                    )                
                ]):
                null
            ]
        }
    }
}


function SearchForm(): m.Component<{
    term:string|null, 
    onSearchRequested: (term:string) => void
}> {
    let term = "";

    return {
        oninit: function(vnode) {        
            console.log("SearchForm::oninit vnode.attrs:", vnode.attrs);
            term = vnode.attrs.term || ""; // populated from the `history.state` property if the user presses the back button
        },
        onupdate: function(vnode) {
            console.log("SearchForm::onupdate vnode.attrs:", vnode.attrs);
        },
        view: function(vnode) {
            return m("form", [                
                m("input", {
                    oninput: event => { 
                        term = event.target.value 
                    },
                    value: term
                }),
                m("button", {
                    onclick: (event) => {
                        event.preventDefault();
                        vnode.attrs.onSearchRequested(term);
                    }
                }, "Search")
            ])
        }
    }
}