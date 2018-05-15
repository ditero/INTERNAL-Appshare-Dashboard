define(['ojs/ojcore', 'text!./retention-graph-view.html', './retention-graph-viewModel', 'text!./component.json', 'css!./retention-graph-styles', 'ojs/ojcomposite'],
  function(oj, view, viewModel, metadata) {
    oj.Composite.register('retention-graph', {
      view: {inline: view}, 
      viewModel: {inline: viewModel}, 
      metadata: {inline: JSON.parse(metadata)}
    });
  }
);