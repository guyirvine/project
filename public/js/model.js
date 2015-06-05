/******************************************************************************/
function Project(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);
  self.selected=ko.observable(false);

  self.select = function() {
    vm.show_project( self.id );
  };
}

/******************************************************************************/
function Outcome(id, p, n, d, s) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.description=ko.observable(d);
  self.seq=s;

  self.select = function() {
    vm.currentOutcome( self );
    vm.show("outcome-form");
    $( 'section.outcome-form input' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    if ( self.id === null ) {
      vm.add_outcome( self );
    }

    da.update_outcome( self );
  };
}

/******************************************************************************/
function Backlog(id, p, n, d, s) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.description=ko.observable(d);
  self.seq=s;

  self.select = function() {
    vm.currentBacklogItem( self );
    vm.show("backlog-form");
    $( 'section.backlog-form input' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    if ( self.id === null ) {
      vm.add_backlog( self );
    }
    da.update_backlog( self );
  };
}

/******************************************************************************/
function Persona(id, p, n, r, s) {
  var self=this;

  self.id = id;
  self.project=ko.observable(p);
  self.name=ko.observable(n);
  self.role=ko.observable(r);
  self.seq=s;

  self.labelHtml=ko.computed(function() {
    return self.name() + " <span class='role'>- " + self.role() + "</span>";
  });

  self.label=ko.computed(function() {
    return self.name() + " - " + self.role();
  });


  self.select = function() {
    vm.currentPersona( self );
    vm.show("persona-form");
    $( 'section.persona-form input.name' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    if ( self.id === null ) {
      vm.add_persona( self );
    }

    da.update_persona( self );
  };
}

/******************************************************************************/
function Hypothesis(id, pr, o, p, d, i, u, s) {
  var self=this;

  self.id = id;
  self.project = ko.observable(pr);
  self.outcome=ko.observable(o);
  self.persona=ko.observable(p);
  self.description=ko.observable(d);
  self.importance=ko.observable(i);
  self.uncertainty=ko.observable(u);
  self.seq=s;

  self.select = function(e) {
    vm.show("hypothesis-form");
    vm.currentHypothesis( self );
    $( 'section.hypothesis-form textarea' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    if ( self.id === null ) {
      vm.add_hypothesis( self );
    }

    da.update_hypothesis( self );
  };
}
