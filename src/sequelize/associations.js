module.exports = {
	applyAssociations: (sequelize, model) => {
		switch(model) {
			case 'CalendarEvent': 
				sequelize.models.CalendarEvent.belongsTo(sequelize.models.CalendarWeek, { 
					foreignKey: 'calendarWeek', 
					constraints: false 
				});
				break;
			case 'CalendarWeek':
				sequelize.models.CalendarWeek.hasMany(sequelize.models.CalendarEvent, {
					foreignKey: 'calendarEvent',
  					constraints: false
 				});
 				break;
		}
	}
}
