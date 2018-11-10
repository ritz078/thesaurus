import React from "react";
import {
  SearchInput,
  Tab,
  Tablist,
  Pane,
  UnorderedList,
  ListItem,
  Text,
  Icon,
  Spinner,
  Link,
  Button
} from "evergreen-ui";
import { uniqBy, debounce } from "lodash";
import Progress from "react-progress-2";

if (typeof window !== "undefined") {
  window.io = require("socket.io-client");
}

const Logo = props => {
  return (
    <svg
      width="372px"
      height="41px"
      viewBox="0 0 372 41"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <path
        d="M34.732 38.094V40.5H.718v-2.406h12.644V8.948H2.285V1.395h30.88v7.553H22.09v29.146h12.643zm42.986 0V40.5H64.179V25.115H48.627V40.5H35.088v-2.406H39.9V1.395h8.728v16.336h15.552V1.395h8.727v36.7h4.812zm5.167 0V1.395h28.196v7.776H91.612v8.056h17.51v7.44h-17.51v8.113h20.084v5.314h5.427V40.5H77.458v-2.406h5.427zm67.824 0V40.5h-35.692v-2.406h7.608a22.69 22.69 0 0 1-5.594-4.028l5.203-6.377c4.214 3.692 8.112 5.538 11.692 5.538 1.604 0 2.863-.345 3.776-1.035.914-.69 1.37-1.622 1.37-2.797s-.484-2.107-1.454-2.797-2.89-1.39-5.762-2.098c-4.55-1.082-7.879-2.49-9.986-4.224-2.107-1.734-3.16-4.457-3.16-8.168 0-3.71 1.333-6.573 4-8.587C125.375 1.507 128.704.5 132.694.5c2.611 0 5.222.448 7.832 1.343 2.611.895 4.886 2.163 6.826 3.804l-4.42 6.377c-3.394-2.573-6.9-3.86-10.517-3.86-1.455 0-2.602.345-3.441 1.035-.84.69-1.259 1.604-1.259 2.742 0 1.137.513 2.042 1.539 2.713 1.025.671 3.394 1.464 7.105 2.377 3.71.914 6.592 2.285 8.643 4.112 2.051 1.828 3.077 4.364 3.077 7.609 0 4.028-1.51 7.142-4.532 9.342h7.161zm47.74 0V40.5h-14.712l-3.637-8.448H163.71l-3.637 8.448H145.36v-2.406h6.434L167.68 1.395h8.447l15.832 36.7h6.49zm-26.517-25.063l-4.923 11.357h9.79l-4.867-11.357zm63.182 25.063V40.5H193.1v-2.406h11.132c-4.587-3.058-6.88-8-6.88-14.825V1.395h8.727V22.99c0 3.132.727 5.603 2.181 7.412 1.455 1.809 3.413 2.713 5.875 2.713 2.461 0 4.41-.904 5.846-2.713 1.436-1.809 2.154-4.28 2.154-7.412V1.395h8.727V23.27c0 6.825-2.275 11.767-6.825 14.825h11.077zm5.167 0V1.395h14.825c6.08 0 10.415 1.026 13.007 3.077 2.592 2.051 3.888 5.352 3.888 9.902 0 6.266-2.48 10.312-7.44 12.14l8.167 11.58h5.26V40.5H263.72l-8.671-12.476h-6.042V40.5h-14.154v-2.406h5.427zm15.105-17.622c2.983 0 5.016-.485 6.098-1.455 1.081-.97 1.622-2.508 1.622-4.615s-.56-3.552-1.678-4.336c-1.12-.783-3.077-1.174-5.874-1.174h-6.546v11.58h6.378zm63.125 17.622V40.5h-42.014v-2.406h11.133c-4.588-3.058-6.881-8-6.881-14.825V1.395h8.727V22.99c0 3.132.727 5.603 2.182 7.412 1.454 1.809 3.412 2.713 5.874 2.713 2.461 0 4.41-.904 5.846-2.713 1.436-1.809 2.154-4.28 2.154-7.412V1.395h8.727V23.27c0 6.825-2.275 11.767-6.825 14.825h11.077zm36.048 0V40.5h-35.692v-2.406h7.608a22.69 22.69 0 0 1-5.594-4.028l5.203-6.377c4.214 3.692 8.112 5.538 11.692 5.538 1.604 0 2.862-.345 3.776-1.035.914-.69 1.37-1.622 1.37-2.797s-.484-2.107-1.454-2.797-2.89-1.39-5.762-2.098c-4.55-1.082-7.879-2.49-9.986-4.224-2.107-1.734-3.16-4.457-3.16-8.168 0-3.71 1.333-6.573 4-8.587C329.225 1.507 332.554.5 336.544.5c2.611 0 5.222.448 7.832 1.343 2.611.895 4.886 2.163 6.826 3.804l-4.42 6.377c-3.394-2.573-6.9-3.86-10.517-3.86-1.455 0-2.602.345-3.441 1.035-.84.69-1.259 1.604-1.259 2.742 0 1.137.513 2.042 1.539 2.713 1.025.671 3.394 1.464 7.105 2.377 3.71.914 6.592 2.285 8.643 4.112 2.051 1.828 3.077 4.364 3.077 7.609 0 4.028-1.51 7.142-4.532 9.342h7.161zm.356 2.406v-2.406h4.252c-.746-.857-1.119-1.948-1.119-3.272 0-1.324.476-2.462 1.427-3.413.95-.951 2.116-1.426 3.496-1.426s2.546.475 3.497 1.426c.95.951 1.426 2.08 1.426 3.385 0 1.305-.391 2.405-1.175 3.3h4.308V40.5h-16.112z"
        fill="#aaa"
        fillRule="evenodd"
      />
    </svg>
  );
};

function f(results = []) {
  return {
    synonyms: uniqBy(
      results.filter(
        result =>
          (!result.category ||
            result.category === "noun" ||
            result.category === "adj" ||
            result.category === "adjective") &&
          !result.lang
      ),
      e => e.word.toLowerCase()
    ),
    otherLang: uniqBy(results.filter(result => result.lang), e =>
      e.word.toLowerCase()
    ),
    soundsSimilar: uniqBy(
      results.filter(result => result.category === "sounds kind of like"),
      e => e.word.toLowerCase()
    ),
    rhyming: uniqBy(
      results.filter(result => result.category === "rhymes with"),
      e => e.word.toLowerCase()
    )
  };
}

const tabs = [
  {
    name: "English Synonyms",
    key: "synonyms",
    sub: "category"
  },
  {
    name: "Other Languages",
    key: "otherLang",
    sub: "lang"
  },
  {
    name: "Sounds Similar",
    key: "soundsSimilar"
  },
  {
    name: "Words that rhyme",
    key: "rhyming"
  }
];

export default class extends React.PureComponent {
  state = {
    results: {},
    query: "",
    tabIndex: 0,
    loading: false
  };

  handleQueryChange = text => {
    const _text = text && text.trim();
    if (_text && _text.length > 1 && !this.state.results[_text]) {
      this.setState(
        {
          query: _text,
          loading: true
        },
        () => {
          Progress.show();
          this.socket.emit("get.synonyms", _text);
          this.socket.emit("get.synonyms.lang", _text);
        }
      );
    }
  };

  debouncedChange = debounce(this.handleQueryChange, 1000);

  handleResults = result => {
    const { results } = this.state;
    const _query = Array.isArray(result) ? result[0].query : result.query;
    return this.setState({
      results: {
        ...results,
        [_query]: [
          ...(results[_query] || []),
          ...(Array.isArray(result) ? result : [result])
        ]
      }
    });
  };

  componentDidMount() {
    this.socket = io.connect("http://localhost:3000");
    this.socket.on("synonyms", this.handleResults);
    this.socket.on("synonyms.lang", this.handleResults);
    this.socket.on("complete", () => {
      Progress.hide();
      this.setState({
        loading: false
      });
    });
  }

  render() {
    const { tabIndex, results, query } = this.state;

    const _results = f(results[query]);
    return (
      <div>
        <style jsx>{`
          header {
            padding: 20px 15px;
            margin: 0 auto;
            border-bottom: 1px solid #eee;
            background-color: #f9f9f9;
            display: flex;
            flex-direction: row;
          }

          .inner {
            margin: 0 auto;
            max-width: 1000px;
            width: 100%;
          }

          .header {
            display: flex;
            flex-direction: row;
            padding: 0 10px;
          }

          .content {
            padding: 10px;
            min-height: calc(100vh - 131px);
            overflow: auto;
          }

          .x {
            border: 0 !important;
          }
        `}</style>

        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}</style>
        <header>
          <div className="inner header">
            <Logo width="150px" />

            <SearchInput
              width="100%"
              height={40}
              onChange={e => this.debouncedChange(e.target.value)}
              placeholder="Enter your word"
              marginLeft="20px"
            />
          </div>
        </header>

        <div className="inner content">
          <Pane>
            <Pane display="flex">
              <Tablist flex={1} marginBottom={16} flexBasis={240} marginRight={24}>
                {tabs.map(({ name, key }, index) => (
                  <Tab
                    key={key}
                    id={key}
                    onSelect={() => this.setState({ tabIndex: index })}
                    isSelected={index === tabIndex}
                    aria-controls={`panel-${key}`}
                  >
                    {name}
                  </Tab>
                ))}
              </Tablist>
              <Link href="https://github.com/ritz078/thesaurus" rel="noopener" textDecoration="none"><Button iconBefore="code">GitHub</Button></Link>
            </Pane>
            <Pane padding={16} background="tint1" flex="1">
              {!Object.keys(results).length && !this.state.loading && (
                <Pane
                  alignItems="center"
                  flex={1}
                  justifyContent="center"
                  display="flex"
                  height={300}
                  flexDirection="column"
                >
                  <Icon icon="search" size={50} color="disabled" />

                  <Text size={500} marginTop="40px" color="muted">
                    You haven't searched for anything yet.
                  </Text>
                </Pane>
              )}
              {tabs.map(({ name, key, sub }, index) => (
                <React.Fragment key={key}>
                  {this.state.loading && !_results[key].length && (
                    <Pane
                      alignItems="center"
                      flex={1}
                      justifyContent="center"
                      height={500}
                      flexDirection="column"
                      display={index === tabIndex ? "flex" : "none"}
                    >
                      <Spinner />
                    </Pane>
                  )}

                  {!_results[key].length &&
                    !this.state.loading &&
                    !!Object.keys(results).length && (
                      <Pane
                        alignItems="center"
                        flex={1}
                        justifyContent="center"
                        display={index === tabIndex ? "flex" : "none"}
                        height={200}
                        flexDirection="column"
                      >
                        <Text size={500} color="muted">
                          😞 No Result found.
                        </Text>
                      </Pane>
                    )}

                  <Pane
                    id={`panel-${name}`}
                    role="tabpanel"
                    aria-labelledby={name}
                    height="auto"
                    aria-hidden={index !== tabIndex}
                    display={index === tabIndex ? "flex" : "none"}
                  >
                    <UnorderedList>
                      {_results[key].map(result => {
                        return (
                          <ListItem
                            width="33%"
                            float="left"
                            key={result.word}
                            paddingRight="10px"
                            minWidth={250}
                          >
                            {result.word
                              .replace("(similar term)", "")
                              .replace("(generic term)", "")}

                            {result[sub] && (
                              <Text size={300} color="muted">
                                &nbsp;&nbsp;({result[sub]})
                              </Text>
                            )}
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </Pane>
                </React.Fragment>
              ))}
            </Pane>
          </Pane>
        </div>

        <footer>
          <Pane
            display="flex"
            width="100%"
            height="50px"
            background="tint2"
            alignItems="center"
            justifyContent="center"
            borderTop="muted"
          >
            <Text display="inline-flex" textAlign="center">
              Made with ❤️ by&nbsp;{" "}
              <Link href="https://twitter.com/ritz078">ritz078</Link>
            </Text>
          </Pane>
        </footer>
      </div>
    );
  }
}
