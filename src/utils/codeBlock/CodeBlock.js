import React, { PureComponent } from 'react';
import Types from 'prop-types';

class CodeBlock extends PureComponent {
  static propTypes = {
    lang: Types.string,
    children: Types.node.isRequired,
  };

  static defaultProps = {
    lang: 'jsx',
  };

  render() {
    let sourceCode = this.props.children;
    if (typeof this.props.children === 'string') {
      sourceCode = fixLeadingIndentation(this.props.children);
    }
    return (
      <pre>
        <code className={`tw-docs-code language-${this.props.lang}`}>{sourceCode}</code>
      </pre>
    );
  }
}

function fixLeadingIndentation(string) {
  const lines = string.split('\n');
  const indent = Math.min(...lines.filter(line => line.trim()).map(line => line.search(/\S/)));
  return lines
    .map(line => line.substring(indent))
    .join('\n')
    .trim();
}

export default CodeBlock;
