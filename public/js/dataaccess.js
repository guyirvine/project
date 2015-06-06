function DataAccess() {
  var self = this;

  /****************************************************************************/
  self.update_outcome = function(o) {
    data = {
      project_id: o.project().id,
      name: o.name(),
      description: o.description(),
      seq: o.seq
    };

    if ( o.id === null ) {
      $.post( "/outcome", JSON.stringify(data), function(id) {
        o.id = id;
      });
    } else {
      $.post( "/outcome/" + o.id, JSON.stringify(data), function() {
      });
    }
  };

  /****************************************************************************/
  self.update_persona = function(p) {
    data = {
      project_id: p.project().id,
      name: p.name(),
      role: p.role(),
      seq: p.seq
    };

    if ( p.id === null ) {
      $.post( "/persona", JSON.stringify(data), function(id) {
        p.id = id;
      });
    } else {
      $.post( "/persona/" + p.id, JSON.stringify(data), function() {
      });
    }
  };

  /****************************************************************************/
  self.update_hypothesis = function(h) {
    data = {
      project_id: h.project().id,
      outcome_id: h.outcome().id,
      persona_id: h.persona().id,
      description: h.description(),
      status_id: h.status().id,
      seq: h.seq
    };

    if ( h.id === null ) {
      $.post( "/hypothesis", JSON.stringify(data), function(id) {
        h.id=id;
      });
    } else {
      $.post( "/hypothesis/" + h.id, JSON.stringify(data), function() {
      });
    }
  };

  /****************************************************************************/
  self.get_for_project = function(id) {
    if ( vm.current_project() !== undefined ) {
      vm.current_project().selected( false );
    }
    $.when(
      $.get('/project/' + id + '/outcome'),
      $.get('/project/' + id + '/persona'),
      $.get('/project/' + id + '/hypothesis')
    ).done(function( outcome_data, persona_data, hypothesis_data ) {
      vm.current_project( vm.project_idx[id] );
      vm.current_project().selected( true );

      vm.outcome_list.removeAll();
      vm.add_outcome( new Outcome( null, vm.current_project(), "", "", 0 ) );
      _.each(JSON.parse( outcome_data[0] ), function(el) {
        vm.add_outcome( new Outcome( el.id, vm.current_project(), el.name, el.description, Number(el.seq) ) );
      });

      vm.persona_list.removeAll();
      vm.add_persona(new Persona( null, vm.current_project(), "", "", 0 ));
      _.each(JSON.parse( persona_data[0] ), function(el) {
        vm.add_persona(new Persona( el.id, vm.current_project(), el.name, el.role, Number(el.seq) ));
      });

      vm.hypothesis_list.removeAll();
      _.each( JSON.parse( hypothesis_data[0] ), function(el) {
        var o=vm.outcome_idx[el.outcome_id];
        var p=vm.persona_idx[el.persona_id];
        var st=vm.status_idx[el.status_id];

        vm.add_hypothesis(new Hypothesis(el.id, vm.current_project(), o, p, el.description, Number(el.importance), Number(el.uncertainty), st, Number(el.seq)));
      });
    });
  };

}
